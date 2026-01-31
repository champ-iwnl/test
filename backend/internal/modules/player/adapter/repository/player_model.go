package repository

import (
	"backend/internal/shared/constants"
	"time"
)

// PlayerModel is the GORM database model
type PlayerModel struct {
	ID          string    `gorm:"type:uuid;primaryKey"`
	Nickname    string    `gorm:"type:varchar(50);uniqueIndex;not null"`
	TotalPoints int       `gorm:"type:integer;not null;default:0"`
	CreatedAt   time.Time `gorm:"not null"`
	UpdatedAt   time.Time `gorm:"not null"`
}

func (PlayerModel) TableName() string {
	return constants.TablePlayers
}
