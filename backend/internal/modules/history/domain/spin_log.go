package domain

import (
	"backend/internal/shared/constants"
	"errors"
	"time"
)

// SpinLog represents a spin event record
type SpinLog struct {
	id           *SpinLogID
	playerID     string
	pointsGained int
	source       constants.SpinSource
	createdAt    time.Time
}

// Constructor for new spin log
func NewSpinLog(
	playerID string,
	pointsGained int,
	source constants.SpinSource,
) (*SpinLog, error) {
	if playerID == "" {
		return nil, errors.New("player ID cannot be empty")
	}
	if pointsGained < 0 {
		return nil, errors.New("points gained cannot be negative")
	}
	if !source.IsValid() {
		return nil, errors.New("invalid spin source")
	}

	return &SpinLog{
		id:           GenerateSpinLogID(),
		playerID:     playerID,
		pointsGained: pointsGained,
		source:       source,
		createdAt:    time.Now(),
	}, nil
}

// Reconstruction from persistence
func ReconstructSpinLog(
	id string,
	playerID string,
	pointsGained int,
	source string,
	createdAt time.Time,
) (*SpinLog, error) {
	spinLogID, err := NewSpinLogID(id)
	if err != nil {
		return nil, err
	}

	sourceEnum := constants.SpinSource(source)
	if !sourceEnum.IsValid() {
		return nil, errors.New("invalid spin source")
	}

	return &SpinLog{
		id:           spinLogID,
		playerID:     playerID,
		pointsGained: pointsGained,
		source:       sourceEnum,
		createdAt:    createdAt,
	}, nil
}

// Accessors
func (s *SpinLog) ID() *SpinLogID {
	return s.id
}

func (s *SpinLog) PlayerID() string {
	return s.playerID
}

func (s *SpinLog) PointsGained() int {
	return s.pointsGained
}

func (s *SpinLog) Source() constants.SpinSource {
	return s.source
}

func (s *SpinLog) CreatedAt() time.Time {
	return s.createdAt
}

// Validation
func (s *SpinLog) IsValid() error {
	if s.id.IsZero() {
		return errors.New("spin log ID is required")
	}
	if s.playerID == "" {
		return errors.New("player ID is required")
	}
	if s.pointsGained < 0 {
		return errors.New("points gained cannot be negative")
	}
	if !s.source.IsValid() {
		return errors.New("invalid spin source")
	}
	return nil
}
