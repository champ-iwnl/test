package application

import (
	"time"
)

// ========== Requests ==========

// Global History Request (cursor-based)
type GetGlobalRequest struct {
	Limit  int    `query:"limit"`
	Cursor string `query:"cursor"`
}

// Personal History Request (cursor-based)
type GetPersonalRequest struct {
	PlayerID string `params:"player_id"`
	Limit    int    `query:"limit"`
	Cursor   string `query:"cursor"`
}

// ========== DTOs ==========

// SpinLogDTO for global history (includes player name)
type GlobalSpinLogDTO struct {
	ID             string    `json:"id"`
	PlayerNickname string    `json:"player_nickname"`
	PointsGained   int       `json:"points_gained"`
	Source         string    `json:"source"`
	CreatedAt      time.Time `json:"created_at"`
}

// SpinLogDTO for personal history
type PersonalSpinLogDTO struct {
	ID           string    `json:"id"`
	PointsGained int       `json:"points_gained"`
	Source       string    `json:"source"`
	CreatedAt    time.Time `json:"created_at"`
}

// ========== Responses (Cursor-based) ==========

// GlobalHistoryResponse (cursor-based)
type GlobalHistoryResponse struct {
	Data       []GlobalSpinLogDTO `json:"data"`
	NextCursor string             `json:"next_cursor,omitempty"`
	HasMore    bool               `json:"has_more"`
}

// PersonalHistoryResponse (cursor-based)
type PersonalHistoryResponse struct {
	Data       []PersonalSpinLogDTO `json:"data"`
	NextCursor string               `json:"next_cursor,omitempty"`
	HasMore    bool                 `json:"has_more"`
}
