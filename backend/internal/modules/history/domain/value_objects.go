package domain

import (
	"errors"

	"github.com/google/uuid"
)

// SpinLogID is a value object for spin log identity
type SpinLogID struct {
	value string
}

func NewSpinLogID(id string) (*SpinLogID, error) {
	if id == "" {
		return nil, errors.New("spin log ID cannot be empty")
	}
	if _, err := uuid.Parse(id); err != nil {
		return nil, errors.New("invalid UUID format for spin log ID")
	}
	return &SpinLogID{value: id}, nil
}

func GenerateSpinLogID() *SpinLogID {
	return &SpinLogID{value: uuid.New().String()}
}

func (s *SpinLogID) String() string {
	return s.value
}

func (s *SpinLogID) IsZero() bool {
	return s.value == ""
}
