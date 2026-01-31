package repository

import (
	"time"

	"backend/internal/shared/constants"
)

// RewardTransactionModel is the GORM database model
type RewardTransactionModel struct {
	ID            string    `gorm:"type:uuid;primaryKey"`
	PlayerID      string    `gorm:"type:uuid;not null;index"`
	CheckpointVal int       `gorm:"type:integer;not null"`
	ClaimedAt     time.Time `gorm:"not null"`

	// For JOIN queries
	RewardConfig *RewardConfigModel `gorm:"foreignKey:CheckpointVal;references:CheckpointVal"`
}

// TableName specifies the table name
func (RewardTransactionModel) TableName() string {
	return constants.TableRewardTransactions
}
