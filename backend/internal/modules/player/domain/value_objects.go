package domain

import (
	"errors"
	"github.com/google/uuid"
)

// PlayerID is a value object for player identity
type PlayerID struct {
	value string
}

// NewPlayerID creates a PlayerID from string (validates UUID format)
func NewPlayerID(id string) (*PlayerID, error) {
	if id == "" {
		return nil, errors.New("player ID cannot be empty")
	}
	if _, err := uuid.Parse(id); err != nil {
		return nil, errors.New("invalid UUID format for player ID")
	}
	return &PlayerID{value: id}, nil
}

// GeneratePlayerID creates a new PlayerID with random UUID
func GeneratePlayerID() *PlayerID {
	return &PlayerID{value: uuid.New().String()}
}

// String returns the string representation
func (p *PlayerID) String() string {
	return p.value
}

// Equals compares two PlayerIDs
func (p *PlayerID) Equals(other *PlayerID) bool {
	if other == nil {
		return false
	}
	return p.value == other.value
}

// IsZero returns true if PlayerID is empty
func (p *PlayerID) IsZero() bool {
	return p.value == ""
}

// Nickname is a value object with validation rules
type Nickname struct {
	value string
}

// NewNickname creates a Nickname with length validation
func NewNickname(name string, minLen, maxLen int) (*Nickname, error) {
	if name == "" {
		return nil, errors.New("nickname cannot be empty")
	}
	if len(name) < minLen {
		return nil, errors.New("nickname too short")
	}
	if len(name) > maxLen {
		return nil, errors.New("nickname too long")
	}
	return &Nickname{value: name}, nil
}

// String returns the string representation
func (n *Nickname) String() string {
	return n.value
}

// Equals compares two Nicknames
func (n *Nickname) Equals(other *Nickname) bool {
	if other == nil {
		return false
	}
	return n.value == other.value
}