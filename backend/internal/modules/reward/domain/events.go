package domain

import (
	"time"

	shared "backend/internal/shared/domain"
)

// RewardClaimedEvent fired when player claims a reward
type RewardClaimedEvent struct {
	shared.BaseEvent
	PlayerID      string
	CheckpointVal int
	RewardName    string
	ClaimedAt     time.Time
}

// NewRewardClaimedEvent creates a new reward claimed event
func NewRewardClaimedEvent(playerID string, checkpointVal int, rewardName string) *RewardClaimedEvent {
	return &RewardClaimedEvent{
		BaseEvent:     shared.NewBaseEvent(playerID),
		PlayerID:      playerID,
		CheckpointVal: checkpointVal,
		RewardName:    rewardName,
		ClaimedAt:     time.Now(),
	}
}

// EventType returns the event type
func (e *RewardClaimedEvent) EventType() string {
	return "reward.claimed"
}
