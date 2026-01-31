package domain

import (
	"context"
	"errors"
)

// RewardConfig represents checkpoint reward configuration
type RewardConfig struct {
	checkpointVal     int
	rewardName        string
	rewardDescription string
}

// NewRewardConfig creates a new reward config
func NewRewardConfig(checkpointVal int, rewardName, rewardDescription string) (*RewardConfig, error) {
	if checkpointVal <= 0 {
		return nil, errors.New("checkpoint value must be positive")
	}
	if rewardName == "" {
		return nil, errors.New("reward name cannot be empty")
	}

	return &RewardConfig{
		checkpointVal:     checkpointVal,
		rewardName:        rewardName,
		rewardDescription: rewardDescription,
	}, nil
}

// CheckpointVal returns the checkpoint value
func (r *RewardConfig) CheckpointVal() int {
	return r.checkpointVal
}

// RewardName returns the reward name
func (r *RewardConfig) RewardName() string {
	return r.rewardName
}

// RewardDescription returns the reward description
func (r *RewardConfig) RewardDescription() string {
	return r.rewardDescription
}

// RewardConfigRepository defines persistence contract
type RewardConfigRepository interface {
	// FindByCheckpoint loads reward config for checkpoint
	FindByCheckpoint(ctx context.Context, checkpointVal int) (*RewardConfig, error)

	// FindAll returns all reward configs
	FindAll(ctx context.Context) ([]*RewardConfig, error)
}
