package domain

import (
	"time"

	shared "backend/internal/shared/domain"
)

// SpinExecutedEvent fired when player spins
type SpinExecutedEvent struct {
	shared.BaseEvent
	PlayerID         string
	PointsGained     int
	TotalPointsAfter int
	Source           string
	SpunAt           time.Time
}

// NewSpinExecutedEvent creates a new spin executed event
func NewSpinExecutedEvent(
	playerID string,
	pointsGained int,
	totalAfter int,
	source string,
) *SpinExecutedEvent {
	return &SpinExecutedEvent{
		BaseEvent:        shared.NewBaseEvent(playerID),
		PlayerID:         playerID,
		PointsGained:     pointsGained,
		TotalPointsAfter: totalAfter,
		Source:           source,
		SpunAt:           time.Now(),
	}
}

// EventType returns the event type
func (e *SpinExecutedEvent) EventType() string {
	return "game.spin_executed"
}
