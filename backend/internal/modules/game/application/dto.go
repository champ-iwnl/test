package application

// SpinRequest represents a spin request
type SpinRequest struct {
	PlayerID string `json:"player_id" example:"uuid-123"`
}

// SpinResponse successful spin response
type SpinResponse struct {
	SpinID           string `json:"spin_id" example:"uuid-456"`
	PointsGained     int    `json:"points_gained" example:"500"`
	TotalPointsAfter int    `json:"total_points_after" example:"1500"`
}

// SpinErrorResponse error response with remaining spins
type SpinErrorResponse struct {
	Code           string `json:"code" example:"DAILY_LIMIT_EXCEEDED"`
	Message        string `json:"message" example:"Daily spin limit reached"`
	RemainingSpins *int   `json:"remaining_spins,omitempty" example:"0"`
}
