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

	// ListAllCursor returns cursor-paginated global history with player info
	ListAllCursor(ctx context.Context, params shared.CursorParams) (*SpinLogCursorResult, error)

	// ListByPlayerCursor returns cursor-paginated history for specific player
	ListByPlayerCursor(ctx context.Context, playerID string, params shared.CursorParams) (*SpinLogCursorResult, error)

	// CountTodayByPlayer counts today's spins for a player (for daily limit)
	CountTodayByPlayer(ctx context.Context, playerID string) (int, error)
}

// SpinLogCursorResult contains cursor-paginated results
type SpinLogCursorResult struct {
	Data       []*SpinLogWithPlayer
	NextCursor string
	HasMore    bool
}

// SpinLogWithPlayer includes player nickname for display
type SpinLogWithPlayer struct {
	SpinLog        *SpinLog
	PlayerNickname string
}
