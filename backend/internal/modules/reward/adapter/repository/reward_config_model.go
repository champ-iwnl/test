package repository

import (
	"backend/internal/shared/constants"
)

// RewardConfigModel is the GORM database model
type RewardConfigModel struct {
	CheckpointVal     int    `gorm:"type:integer;primaryKey"`
	RewardName        string `gorm:"type:varchar(100);not null"`
	RewardDescription string `gorm:"type:text"`
}

// TableName specifies the table name
func (RewardConfigModel) TableName() string {
	return constants.TableRewardConfig
}
