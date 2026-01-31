package application

import "time"

// EnterRequest is input for enter usecase
type EnterRequest struct {
	Nickname string `json:"nickname" validate:"required,min=3,max=50"`
}

// EnterResponse is output for enter usecase
type EnterResponse struct {
	ID          string    `json:"id"`
	Nickname    string    `json:"nickname"`
	TotalPoints int       `json:"total_points"`
	CreatedAt   time.Time `json:"created_at"`
	IsNew       bool      `json:"is_new,omitempty"` // Only for enter
}

// GetProfileRequest is input for get profile usecase
type GetProfileRequest struct {
	PlayerID string `json:"player_id"`
}

// ProfileResponse includes claimed checkpoints (added in Phase 6)
type ProfileResponse struct {
	ID                 string    `json:"id"`
	Nickname           string    `json:"nickname"`
	TotalPoints        int       `json:"total_points"`
	CreatedAt          time.Time `json:"created_at"`
	ClaimedCheckpoints []int     `json:"claimed_checkpoints"` // Phase 6
}
