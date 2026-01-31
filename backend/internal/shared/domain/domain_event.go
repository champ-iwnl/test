package domain

import "time"

// DomainEvent is the marker interface for all domain events
type DomainEvent interface {
    EventType() string
    OccurredAt() time.Time
    AggregateID() string
}

// BaseEvent provides common fields
type BaseEvent struct {
    aggregateID string
    occurredAt  time.Time
}

func NewBaseEvent(aggregateID string) BaseEvent {
    return BaseEvent{
        aggregateID: aggregateID,
        occurredAt:  time.Now(),
    }
}

func (e BaseEvent) OccurredAt() time.Time {
    return e.occurredAt
}

func (e BaseEvent) AggregateID() string {
    return e.aggregateID
}