package domain

import (
	"errors"

	"github.com/google/uuid"
)

// RewardTransactionID is a value object for transaction identity
type RewardTransactionID struct {
	value string
}

// NewRewardTransactionID creates from string
func NewRewardTransactionID(id string) (*RewardTransactionID, error) {
	if id == "" {
		return nil, errors.New("reward transaction ID cannot be empty")
	}
	return &RewardTransactionID{value: id}, nil
}

// GenerateRewardTransactionID creates a new ID
func GenerateRewardTransactionID() *RewardTransactionID {
	return &RewardTransactionID{value: uuid.New().String()}
}

// String returns string representation
func (r *RewardTransactionID) String() string {
	return r.value
}

// IsZero returns true if ID is empty
func (r *RewardTransactionID) IsZero() bool {
	return r.value == ""
}

// Equals compares two IDs
func (r *RewardTransactionID) Equals(other *RewardTransactionID) bool {
	if other == nil {
		return false
	}
	return r.value == other.value
}
