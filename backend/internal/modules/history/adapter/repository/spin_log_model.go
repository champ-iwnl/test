package repository

import (
	"backend/internal/shared/constants"
	"time"
)

type SpinLogModel struct {
	ID           string    `gorm:"type:uuid;primaryKey"`
	PlayerID     string    `gorm:"type:uuid;not null;index:idx_spin_logs_player_id"`
	PointsGained int       `gorm:"type:integer;not null"`
	Source       string    `gorm:"type:varchar(20);not null"`
	CreatedAt    time.Time `gorm:"not null;index:idx_spin_logs_created_at"`

	// For JOIN queries
	Player *PlayerModelRef `gorm:"foreignKey:PlayerID"`
}

func (SpinLogModel) TableName() string {
	return constants.TableSpinLogs
}

type PlayerModelRef struct {
	ID       string `gorm:"type:uuid;primaryKey"`
	Nickname string `gorm:"type:varchar(50)"`
}

func (PlayerModelRef) TableName() string {
	return constants.TablePlayers
}
