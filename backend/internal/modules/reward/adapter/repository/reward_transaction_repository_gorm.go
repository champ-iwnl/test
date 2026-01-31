package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"

	rewarddomain "backend/internal/modules/reward/domain"
)

// RewardTransactionRepositoryGorm implements RewardTransactionRepository
type RewardTransactionRepositoryGorm struct {
	db *gorm.DB
}

// NewRewardTransactionRepositoryGorm creates a new repository
func NewRewardTransactionRepositoryGorm(db *gorm.DB) *RewardTransactionRepositoryGorm {
	return &RewardTransactionRepositoryGorm{db: db}
}

// Store persists a new reward transaction
func (r *RewardTransactionRepositoryGorm) Store(ctx context.Context, tx *rewarddomain.RewardTransaction) error {
	model := &RewardTransactionModel{
		ID:            tx.ID().String(),
		PlayerID:      tx.PlayerID(),
		CheckpointVal: tx.CheckpointVal(),
		ClaimedAt:     tx.ClaimedAt(),
	}

	result := r.db.WithContext(ctx).Create(model)
	return result.Error
}

// FindByID loads transaction by ID
func (r *RewardTransactionRepositoryGorm) FindByID(ctx context.Context, id *rewarddomain.RewardTransactionID) (*rewarddomain.RewardTransaction, error) {
	var model RewardTransactionModel
	result := r.db.WithContext(ctx).Where("id = ?", id.String()).First(&model)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("reward transaction not found")
		}
		return nil, result.Error
	}

	return rewarddomain.ReconstructRewardTransaction(
		model.ID,
		model.PlayerID,
		model.CheckpointVal,
		model.ClaimedAt,
	)
}

// ExistsByPlayerAndCheckpoint checks if player already claimed this checkpoint
func (r *RewardTransactionRepositoryGorm) ExistsByPlayerAndCheckpoint(ctx context.Context, playerID string, checkpointVal int) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&RewardTransactionModel{}).
		Where("player_id = ? AND checkpoint_val = ?", playerID, checkpointVal).
		Count(&count).Error
	return count > 0, err
}

// GetClaimedCheckpoints returns just the checkpoint values
func (r *RewardTransactionRepositoryGorm) GetClaimedCheckpoints(ctx context.Context, playerID string) ([]int, error) {
	var checkpoints []int
	err := r.db.WithContext(ctx).
		Model(&RewardTransactionModel{}).
		Where("player_id = ?", playerID).
		Order("checkpoint_val ASC").
		Pluck("checkpoint_val", &checkpoints).Error
	return checkpoints, err
}

// ListByPlayer returns all rewards claimed by player with config info
func (r *RewardTransactionRepositoryGorm) ListByPlayer(ctx context.Context, playerID string) ([]*rewarddomain.RewardTransactionWithConfig, error) {
	var models []*RewardTransactionModel
	err := r.db.WithContext(ctx).
		Preload("RewardConfig").
		Where("player_id = ?", playerID).
		Order("claimed_at DESC").
		Find(&models).Error

	if err != nil {
		return nil, err
	}

	results := make([]*rewarddomain.RewardTransactionWithConfig, 0, len(models))
	for _, model := range models {
		tx, err := rewarddomain.ReconstructRewardTransaction(
			model.ID,
			model.PlayerID,
			model.CheckpointVal,
			model.ClaimedAt,
		)
		if err != nil {
			continue
		}

		rewardName := ""
		rewardDesc := ""
		if model.RewardConfig != nil {
			rewardName = model.RewardConfig.RewardName
			rewardDesc = model.RewardConfig.RewardDescription
		}

		results = append(results, &rewarddomain.RewardTransactionWithConfig{
			Transaction:       tx,
			RewardName:        rewardName,
			RewardDescription: rewardDesc,
		})
	}

	return results, nil
}
