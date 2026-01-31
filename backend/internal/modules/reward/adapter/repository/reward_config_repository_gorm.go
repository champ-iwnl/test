package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"

	rewarddomain "backend/internal/modules/reward/domain"
	shared "backend/internal/shared/domain"
)

// RewardConfigRepositoryGorm implements RewardConfigRepository
type RewardConfigRepositoryGorm struct {
	db *gorm.DB
}

// NewRewardConfigRepositoryGorm creates a new repository
func NewRewardConfigRepositoryGorm(db *gorm.DB) *RewardConfigRepositoryGorm {
	return &RewardConfigRepositoryGorm{db: db}
}

// FindByCheckpoint loads reward config for checkpoint
func (r *RewardConfigRepositoryGorm) FindByCheckpoint(ctx context.Context, checkpointVal int) (*rewarddomain.RewardConfig, error) {
	var model RewardConfigModel
	result := r.db.WithContext(ctx).Where("checkpoint_val = ?", checkpointVal).First(&model)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, shared.ErrInvalidCheckpoint
		}
		return nil, result.Error
	}

	return rewarddomain.NewRewardConfig(
		model.CheckpointVal,
		model.RewardName,
		model.RewardDescription,
	)
}

// FindAll returns all reward configs
func (r *RewardConfigRepositoryGorm) FindAll(ctx context.Context) ([]*rewarddomain.RewardConfig, error) {
	var models []RewardConfigModel
	err := r.db.WithContext(ctx).Order("checkpoint_val ASC").Find(&models).Error
	if err != nil {
		return nil, err
	}

	configs := make([]*rewarddomain.RewardConfig, 0, len(models))
	for _, model := range models {
		config, err := rewarddomain.NewRewardConfig(
			model.CheckpointVal,
			model.RewardName,
			model.RewardDescription,
		)
		if err != nil {
			continue
		}
		configs = append(configs, config)
	}

	return configs, nil
}
