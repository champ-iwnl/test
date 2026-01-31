package get_profile

import (
	"backend/internal/modules/player/application"
	"backend/internal/modules/player/domain"
	rewarddomain "backend/internal/modules/reward/domain"
	shared "backend/internal/shared/domain"
	"context"
	"errors"
)

// UseCase handles get player profile
type UseCase struct {
	playerRepo   domain.PlayerRepository
	rewardTxRepo interface{}
}

func New(repo domain.PlayerRepository, rewardTxRepo interface{}) *UseCase {
	return &UseCase{
		playerRepo:   repo,
		rewardTxRepo: rewardTxRepo,
	}
}

// Execute retrieves player profile
func (uc *UseCase) Execute(ctx context.Context, req application.GetProfileRequest) (*application.ProfileResponse, error) {
	// Validate request
	if req.PlayerID == "" {
		return nil, errors.New("player ID is required")
	}

	// Parse player ID
	playerID, err := domain.NewPlayerID(req.PlayerID)
	if err != nil {
		return nil, err
	}

	// Find player
	player, err := uc.playerRepo.FindByID(ctx, playerID)
	if err != nil {
		if errors.Is(err, shared.ErrPlayerNotFound) {
			return nil, shared.ErrPlayerNotFound
		}
		return nil, err
	}

	// Get claimed checkpoints
	claimedCheckpoints := []int{}
	if uc.rewardTxRepo != nil {
		if repo, ok := uc.rewardTxRepo.(rewarddomain.RewardTransactionRepository); ok {
			if checkpoints, err := repo.GetClaimedCheckpoints(ctx, req.PlayerID); err == nil {
				claimedCheckpoints = checkpoints
			}
		}
	}

	return &application.ProfileResponse{
		ID:                 player.ID().String(),
		Nickname:           player.Nickname().String(),
		TotalPoints:        player.TotalPoints().Value(),
		CreatedAt:          player.CreatedAt(),
		ClaimedCheckpoints: claimedCheckpoints,
	}, nil
}
