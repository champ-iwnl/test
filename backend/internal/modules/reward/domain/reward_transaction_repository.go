package domain

import "context"

// RewardTransactionRepository defines persistence contract
type RewardTransactionRepository interface {
	// Store persists a new reward transaction
	Store(ctx context.Context, tx *RewardTransaction) error

	// FindByID loads transaction by ID
	FindByID(ctx context.Context, id *RewardTransactionID) (*RewardTransaction, error)

	// ExistsByPlayerAndCheckpoint checks if player already claimed this checkpoint
	ExistsByPlayerAndCheckpoint(ctx context.Context, playerID string, checkpointVal int) (bool, error)

	// GetClaimedCheckpoints returns all checkpoints claimed by player
	GetClaimedCheckpoints(ctx context.Context, playerID string) ([]int, error)

	// ListByPlayer returns all rewards claimed by player with config info
	ListByPlayer(ctx context.Context, playerID string) ([]*RewardTransactionWithConfig, error)
}

// RewardTransactionWithConfig includes reward config details
type RewardTransactionWithConfig struct {
	Transaction       *RewardTransaction
	RewardName        string
	RewardDescription string
}
