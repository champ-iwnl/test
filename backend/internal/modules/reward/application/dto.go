package application

// ClaimRequest for POST /rewards/claim
type ClaimRequest struct {
	PlayerID      string `json:"player_id" validate:"required"`
	CheckpointVal int    `json:"checkpoint_val" validate:"required,gt=0"`
}

// ClaimResponse
type ClaimResponse struct {
	ID            string `json:"id"`
	CheckpointVal int    `json:"checkpoint_val"`
	RewardName    string `json:"reward_name"`
	ClaimedAt     string `json:"claimed_at"`
}

// GetHistoryRequest for GET /rewards/:player_id
type GetHistoryRequest struct {
	PlayerID string `params:"player_id"`
}

// RewardHistoryDTO
type RewardHistoryDTO struct {
	ID                string `json:"id"`
	CheckpointVal     int    `json:"checkpoint_val"`
	RewardName        string `json:"reward_name"`
	RewardDescription string `json:"reward_description"`
	ClaimedAt         string `json:"claimed_at"`
}

// GetHistoryResponse
type GetHistoryResponse struct {
	Data []RewardHistoryDTO `json:"data"`
}

// GetConfigRequest for GET /rewards/config
type GetConfigRequest struct{}

// RewardConfigDTO
type RewardConfigDTO struct {
	CheckpointVal     int    `json:"checkpoint_val"`
	RewardName        string `json:"reward_name"`
	RewardDescription string `json:"reward_description"`
}

// GetConfigResponse
type GetConfigResponse struct {
	Checkpoints []RewardConfigDTO `json:"checkpoints"`
}
