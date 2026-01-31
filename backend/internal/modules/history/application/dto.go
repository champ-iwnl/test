package application

import (
	"time"
)

// Global History Request
type GetGlobalRequest struct {
	Limit  int `query:"limit"`
	Offset int `query:"offset"`
}

// Personal History Request
type GetPersonalRequest struct {
	PlayerID string `params:"player_id"`
	Limit    int    `query:"limit"`
	Offset   int    `query:"offset"`
}

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

// GlobalHistoryResponse
type GlobalHistoryResponse struct {
	Data   []GlobalSpinLogDTO `json:"data"`
	Total  int64              `json:"total"`
	Limit  int                `json:"limit"`
	Offset int                `json:"offset"`
}

// PersonalHistoryResponse
type PersonalHistoryResponse struct {
	Data   []PersonalSpinLogDTO `json:"data"`
	Total  int64                `json:"total"`
	Limit  int                  `json:"limit"`
	Offset int                  `json:"offset"`
}
