package domain

import "context"

// DailySpinLimitChecker interface for checking daily limit
type DailySpinLimitChecker interface {
	// CountTodaySpins returns number of spins today for player
	CountTodaySpins(ctx context.Context, playerID string) (int, error)
}

// DailyLimitSpec checks if player has exceeded daily limit
type DailyLimitSpec struct {
	maxDailySpins int
	checker       DailySpinLimitChecker
}

// NewDailyLimitSpec creates a new daily limit spec
func NewDailyLimitSpec(maxDailySpins int, checker DailySpinLimitChecker) *DailyLimitSpec {
	return &DailyLimitSpec{
		maxDailySpins: maxDailySpins,
		checker:       checker,
	}
}

// IsSatisfied returns true if player CAN spin (has not exceeded limit)
func (s *DailyLimitSpec) IsSatisfied(ctx context.Context, playerID string) (bool, error) {
	count, err := s.checker.CountTodaySpins(ctx, playerID)
	if err != nil {
		return false, err
	}
	return count < s.maxDailySpins, nil
}

// RemainingSpins returns how many spins left today
func (s *DailyLimitSpec) RemainingSpins(ctx context.Context, playerID string) (int, error) {
	count, err := s.checker.CountTodaySpins(ctx, playerID)
	if err != nil {
		return 0, err
	}
	remaining := s.maxDailySpins - count
	if remaining < 0 {
		return 0, nil
	}
	return remaining, nil
}
