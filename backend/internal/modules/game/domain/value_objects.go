package domain

import (
	"time"

	shared "backend/internal/shared/domain"
)

// SpinResult represents the outcome of a spin
type SpinResult struct {
	spinLogID        string
	pointsGained     *shared.Points
	totalPointsAfter *shared.Points
	spunAt           time.Time
}

// NewSpinResult creates a new spin result
func NewSpinResult(
	spinLogID string,
	pointsGained *shared.Points,
	totalPointsAfter *shared.Points,
) *SpinResult {
	return &SpinResult{
		spinLogID:        spinLogID,
		pointsGained:     pointsGained,
		totalPointsAfter: totalPointsAfter,
		spunAt:           time.Now(),
	}
}

// SpinLogID returns the spin log ID
func (s *SpinResult) SpinLogID() string {
	return s.spinLogID
}

// PointsGained returns the points gained
func (s *SpinResult) PointsGained() *shared.Points {
	return s.pointsGained
}

// TotalPointsAfter returns total points after spin
func (s *SpinResult) TotalPointsAfter() *shared.Points {
	return s.totalPointsAfter
}

// SpunAt returns the spin timestamp
func (s *SpinResult) SpunAt() time.Time {
	return s.spunAt
}
