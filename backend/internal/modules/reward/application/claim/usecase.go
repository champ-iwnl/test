package claim

import (
	"context"

	"backend/internal/modules/player/domain"
	rewarddomain "backend/internal/modules/reward/domain"
	shared "backend/internal/shared/domain"
)

// Request for claim reward
type Request struct {
	PlayerID      string
	CheckpointVal int
}

// Response for claim reward
type Response struct {
	ID            string
	CheckpointVal int
	RewardName    string
	ClaimedAt     string
}

// UseCase handles reward claiming
type UseCase struct {
	rewardTxRepo     rewarddomain.RewardTransactionRepository
	rewardConfigRepo rewarddomain.RewardConfigRepository
	playerRepo       domain.PlayerRepository
}

// New creates a new claim use case
func New(
	txRepo rewarddomain.RewardTransactionRepository,
	configRepo rewarddomain.RewardConfigRepository,
	playerRepo domain.PlayerRepository,
) *UseCase {
	return &UseCase{
		rewardTxRepo:     txRepo,
		rewardConfigRepo: configRepo,
		playerRepo:       playerRepo,
	}
}

// Execute claims a reward for player
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
	// 1. Parse player ID
	playerID, err := domain.NewPlayerID(req.PlayerID)
	if err != nil {
		return nil, shared.ErrPlayerNotFound
	}

	// 2. Get player
	player, err := uc.playerRepo.FindByID(ctx, playerID)
	if err != nil {
		return nil, shared.ErrPlayerNotFound
	}

	// 3. Get reward config for checkpoint
	config, err := uc.rewardConfigRepo.FindByCheckpoint(ctx, req.CheckpointVal)
	if err != nil {
		return nil, shared.ErrInvalidCheckpoint
	}

	// 4. Check if player has enough points
	requiredPoints, _ := shared.NewPoints(req.CheckpointVal)
	if !player.TotalPoints().IsGreaterThanOrEqual(requiredPoints) {
		return nil, shared.ErrInsufficientPoints
	}

	// 5. Check if already claimed
	exists, _ := uc.rewardTxRepo.ExistsByPlayerAndCheckpoint(ctx, req.PlayerID, req.CheckpointVal)
	if exists {
		return nil, shared.ErrAlreadyClaimed
	}

	// 6. Create transaction
	tx, err := rewarddomain.NewRewardTransaction(req.PlayerID, req.CheckpointVal)
	if err != nil {
		return nil, err
	}

	// 7. Store
	if err := uc.rewardTxRepo.Store(ctx, tx); err != nil {
		return nil, err
	}

	// 8. Return response
	return &Response{
		ID:            tx.ID().String(),
		CheckpointVal: tx.CheckpointVal(),
		RewardName:    config.RewardName(),
		ClaimedAt:     tx.ClaimedAt().Format("2006-01-02T15:04:05Z07:00"),
	}, nil
}
