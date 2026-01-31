package repository

import (
	"backend/internal/modules/player/domain"
	shared "backend/internal/shared/domain"
	"context"
	"errors"

	"gorm.io/gorm"
)

// PlayerRepositoryGorm implements domain.PlayerRepository
type PlayerRepositoryGorm struct {
	db      *gorm.DB
	factory *domain.PlayerFactory
}

func NewPlayerRepositoryGorm(db *gorm.DB, factory *domain.PlayerFactory) *PlayerRepositoryGorm {
	return &PlayerRepositoryGorm{
		db:      db,
		factory: factory,
	}
}

// Store stores a new player
func (r *PlayerRepositoryGorm) Store(ctx context.Context, player *domain.Player) error {
	model := r.toModel(player)
	result := r.db.WithContext(ctx).Create(model)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// FindByID loads player by ID
func (r *PlayerRepositoryGorm) FindByID(ctx context.Context, id *domain.PlayerID) (*domain.Player, error) {
	var model PlayerModel
	result := r.db.WithContext(ctx).Where("id = ?", id.String()).First(&model)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, shared.ErrPlayerNotFound
		}
		return nil, result.Error
	}

	return r.toDomain(&model)
}

// FindByNickname loads player by nickname
func (r *PlayerRepositoryGorm) FindByNickname(ctx context.Context, nickname *domain.Nickname) (*domain.Player, error) {
	var model PlayerModel
	result := r.db.WithContext(ctx).Where("nickname = ?", nickname.String()).First(&model)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, shared.ErrPlayerNotFound
		}
		return nil, result.Error
	}

	return r.toDomain(&model)
}

// Update persists changes to existing player
func (r *PlayerRepositoryGorm) Update(ctx context.Context, player *domain.Player) error {
	model := r.toModel(player)
	result := r.db.WithContext(ctx).Save(model)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// ExistsByNickname checks if nickname is taken
func (r *PlayerRepositoryGorm) ExistsByNickname(ctx context.Context, nickname *domain.Nickname) (bool, error) {
	var count int64
	result := r.db.WithContext(ctx).Model(&PlayerModel{}).Where("nickname = ?", nickname.String()).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// toModel converts domain to model
func (r *PlayerRepositoryGorm) toModel(player *domain.Player) *PlayerModel {
	return &PlayerModel{
		ID:          player.ID().String(),
		Nickname:    player.Nickname().String(),
		TotalPoints: player.TotalPoints().Value(),
		CreatedAt:   player.CreatedAt(),
		UpdatedAt:   player.UpdatedAt(),
	}
}

// toDomain converts model to domain
func (r *PlayerRepositoryGorm) toDomain(model *PlayerModel) (*domain.Player, error) {
	return r.factory.ReconstructPlayer(
		model.ID,
		model.Nickname,
		model.TotalPoints,
		model.CreatedAt,
		model.UpdatedAt,
	)
}
