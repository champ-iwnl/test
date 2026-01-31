package domain

import (
	shared "backend/internal/shared/domain"
	"time"
)

// PlayerCreatedEvent fired when new player is created
type PlayerCreatedEvent struct {
	shared.BaseEvent
	Nickname  string
	CreatedAt time.Time
}

func NewPlayerCreatedEvent(playerID, nickname string) *PlayerCreatedEvent {
	event := &PlayerCreatedEvent{
		Nickname:  nickname,
		CreatedAt: time.Now(),
	}
	event.BaseEvent = shared.NewBaseEvent(playerID)
	return event
}

func (e *PlayerCreatedEvent) EventType() string {
	return "player.created"
}

// PlayerEnteredEvent fired when player enters game
type PlayerEnteredEvent struct {
	shared.BaseEvent
	EnteredAt time.Time
}

func NewPlayerEnteredEvent(playerID string) *PlayerEnteredEvent {
	event := &PlayerEnteredEvent{
		EnteredAt: time.Now(),
	}
	event.BaseEvent = shared.NewBaseEvent(playerID)
	return event
}

func (e *PlayerEnteredEvent) EventType() string {
	return "player.entered"
}

// PointsAddedEvent fired when points are added
type PointsAddedEvent struct {
	shared.BaseEvent
	Amount     int
	TotalAfter int
	AddedAt    time.Time
}

func NewPointsAddedEvent(playerID string, amount, totalAfter int) *PointsAddedEvent {
	event := &PointsAddedEvent{
		Amount:     amount,
		TotalAfter: totalAfter,
		AddedAt:    time.Now(),
	}
	event.BaseEvent = shared.NewBaseEvent(playerID)
	return event
}

func (e *PointsAddedEvent) EventType() string {
	return "player.points_added"
}
