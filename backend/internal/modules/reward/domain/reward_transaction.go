package domain

import (
	"errors"
	"time"

	shared "backend/internal/shared/domain"
)

// RewardTransaction represents a claimed reward
type RewardTransaction struct {
	id            *RewardTransactionID
	playerID      string
	checkpointVal int
	claimedAt     time.Time

	// Transient
	domainEvents []shared.DomainEvent
}

// NewRewardTransaction creates a new reward transaction
func NewRewardTransaction(playerID string, checkpointVal int) (*RewardTransaction, error) {
	if playerID == "" {
		return nil, errors.New("player ID cannot be empty")
	}
	if checkpointVal <= 0 {
		return nil, errors.New("checkpoint value must be positive")
	}

	tx := &RewardTransaction{
		id:            GenerateRewardTransactionID(),
		playerID:      playerID,
		checkpointVal: checkpointVal,
		claimedAt:     time.Now(),
		domainEvents:  make([]shared.DomainEvent, 0),
	}

	// Emit domain event
	event := NewRewardClaimedEvent(playerID, checkpointVal, "")
	tx.domainEvents = append(tx.domainEvents, event)

	return tx, nil
}

// ReconstructRewardTransaction rebuilds from persistence
func ReconstructRewardTransaction(
	id string,
	playerID string,
	checkpointVal int,
	claimedAt time.Time,
) (*RewardTransaction, error) {
	txID, err := NewRewardTransactionID(id)
	if err != nil {
		return nil, err
	}

	return &RewardTransaction{
		id:            txID,
		playerID:      playerID,
		checkpointVal: checkpointVal,
		claimedAt:     claimedAt,
		domainEvents:  make([]shared.DomainEvent, 0),
	}, nil
}

// ID returns the transaction ID
func (r *RewardTransaction) ID() *RewardTransactionID {
	return r.id
}

// PlayerID returns the player ID
func (r *RewardTransaction) PlayerID() string {
	return r.playerID
}

// CheckpointVal returns the checkpoint value
func (r *RewardTransaction) CheckpointVal() int {
	return r.checkpointVal
}

// ClaimedAt returns the claim timestamp
func (r *RewardTransaction) ClaimedAt() time.Time {
	return r.claimedAt
}

// DomainEvents returns collected domain events
func (r *RewardTransaction) DomainEvents() []shared.DomainEvent {
	return r.domainEvents
}

// ClearEvents clears all domain events
func (r *RewardTransaction) ClearEvents() {
	r.domainEvents = make([]shared.DomainEvent, 0)
}

// IsValid validates the transaction
func (r *RewardTransaction) IsValid() error {
	if r.id == nil || r.id.IsZero() {
		return errors.New("transaction ID is required")
	}
	if r.playerID == "" {
		return errors.New("player ID is required")
	}
	if r.checkpointVal <= 0 {
		return errors.New("checkpoint value must be positive")
	}
	if r.claimedAt.IsZero() {
		return errors.New("claimed at time is required")
	}
	return nil
}
