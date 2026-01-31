package domain

import (
	"errors"

	"github.com/google/uuid"
)

// PlayerID wraps UUID for type safety
type PlayerID struct {
	value string
}

func NewPlayerID(id string) (*PlayerID, error) {
	if id == "" {
		return nil, errors.New("player ID cannot be empty")
	}

	// Validate UUID format
	if _, err := uuid.Parse(id); err != nil {
		return nil, errors.New("invalid UUID format")
	}

	return &PlayerID{value: id}, nil
}

func (p *PlayerID) String() string {
	return p.value
}

func (p *PlayerID) Equals(other *PlayerID) bool {
	if other == nil {
		return false
	}
	return p.value == other.value
}

func (p *PlayerID) IsZero() bool {
	return p.value == ""
}

// Points wraps integer with business rules
type Points struct {
	amount int
}

func NewPoints(amount int) (*Points, error) {
	if amount < 0 {
		return nil, errors.New("points cannot be negative")
	}
	return &Points{amount: amount}, nil
}

func (p *Points) Add(other *Points) (*Points, error) {
	if other == nil {
		return nil, errors.New("other points cannot be nil")
	}
	return NewPoints(p.amount + other.amount)
}

func (p *Points) Subtract(other *Points) (*Points, error) {
	if other == nil {
		return nil, errors.New("other points cannot be nil")
	}
	return NewPoints(p.amount - other.amount)
}

func (p *Points) Value() int {
	return p.amount
}

func (p *Points) IsGreaterThanOrEqual(other *Points) bool {
	if other == nil {
		return false
	}
	return p.amount >= other.amount
}