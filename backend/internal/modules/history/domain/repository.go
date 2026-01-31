package domain

import (
	shared "backend/internal/shared/domain"
	"context"
)

// SpinLogRepository defines persistence contract
type SpinLogRepository interface {
	// Store persists a new spin log
	Store(ctx context.Context, spinLog *SpinLog) error

	// FindByID loads spin log by ID
	FindByID(ctx context.Context, id *SpinLogID) (*SpinLog, error)

	// ListAll returns paginated global history with player info
	ListAll(ctx context.Context, params shared.PaginationParams) (*SpinLogListResult, error)

	// ListByPlayer returns paginated history for specific player
	ListByPlayer(ctx context.Context, playerID string, params shared.PaginationParams) (*SpinLogListResult, error)

	// CountTodayByPlayer counts today's spins for a player (for daily limit)
	CountTodayByPlayer(ctx context.Context, playerID string) (int, error)
}

// SpinLogListResult contains paginated results with metadata
type SpinLogListResult struct {
	Data   []*SpinLogWithPlayer
	Total  int64
	Limit  int
	Offset int
}

// SpinLogWithPlayer includes player nickname for display
type SpinLogWithPlayer struct {
	SpinLog        *SpinLog
	PlayerNickname string
}
