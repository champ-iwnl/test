package get_history

import (
	"context"

	rewarddomain "backend/internal/modules/reward/domain"
)

// Request for get history
type Request struct {
	PlayerID string
}

// Response for get history
type Response struct {
	Data []RewardHistoryItem
}

// RewardHistoryItem represents a single history entry
type RewardHistoryItem struct {
	ID                string
	CheckpointVal     int
	RewardName        string
	RewardDescription string
	ClaimedAt         string
}

// UseCase handles reward history retrieval
type UseCase struct {
	rewardTxRepo rewarddomain.RewardTransactionRepository
}

// New creates a new get history use case
func New(repo rewarddomain.RewardTransactionRepository) *UseCase {
	return &UseCase{
		rewardTxRepo: repo,
	}
}

// Execute retrieves player's reward claim history
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
	// 1. Get all claimed rewards with config info
	results, err := uc.rewardTxRepo.ListByPlayer(ctx, req.PlayerID)
	if err != nil {
		return nil, err
	}

	// 2. Map to DTOs
	items := make([]RewardHistoryItem, 0, len(results))
	for _, result := range results {
		items = append(items, RewardHistoryItem{
			ID:                result.Transaction.ID().String(),
			CheckpointVal:     result.Transaction.CheckpointVal(),
			RewardName:        result.RewardName,
			RewardDescription: result.RewardDescription,
			ClaimedAt:         result.Transaction.ClaimedAt().Format("2006-01-02T15:04:05Z07:00"),
		})
	}

	// 3. Return response
	return &Response{
		Data: items,
	}, nil
}
