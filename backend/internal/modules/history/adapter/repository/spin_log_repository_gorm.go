package repository

import (
	"backend/internal/modules/history/domain"
	shared "backend/internal/shared/domain"
	"context"
	"errors"
	"time"

	"gorm.io/gorm"
)

type SpinLogRepositoryGorm struct {
	db *gorm.DB
}

func NewSpinLogRepositoryGorm(db *gorm.DB) *SpinLogRepositoryGorm {
	return &SpinLogRepositoryGorm{db: db}
}

func (r *SpinLogRepositoryGorm) Store(ctx context.Context, spinLog *domain.SpinLog) error {
	model := r.toModel(spinLog)
	return r.db.WithContext(ctx).Create(model).Error
}

func (r *SpinLogRepositoryGorm) FindByID(ctx context.Context, id *domain.SpinLogID) (*domain.SpinLog, error) {
	var model SpinLogModel
	err := r.db.WithContext(ctx).Where("id = ?", id.String()).First(&model).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("spin log not found")
		}
		return nil, err
	}
	return r.toDomain(&model)
}

func (r *SpinLogRepositoryGorm) ListAll(ctx context.Context, params shared.PaginationParams) (*domain.SpinLogListResult, error) {
	var models []*SpinLogModel
	var total int64
	if err := r.db.WithContext(ctx).Model(&SpinLogModel{}).Count(&total).Error; err != nil {
		return nil, err
	}

	err := r.db.WithContext(ctx).
		Preload("Player").
		Order("created_at DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&models).Error
	if err != nil {
		return nil, err
	}

	data := make([]*domain.SpinLogWithPlayer, len(models))
	for i, model := range models {
		spinLog, err := r.toDomain(model)
		if err != nil {
			return nil, err
		}
		nickname := ""
		if model.Player != nil {
			nickname = model.Player.Nickname
		}
		data[i] = &domain.SpinLogWithPlayer{
			SpinLog:        spinLog,
			PlayerNickname: nickname,
		}
	}

	return &domain.SpinLogListResult{
		Data:   data,
		Total:  total,
		Limit:  params.Limit,
		Offset: params.Offset,
	}, nil
}

func (r *SpinLogRepositoryGorm) ListByPlayer(ctx context.Context, playerID string, params shared.PaginationParams) (*domain.SpinLogListResult, error) {
	var models []*SpinLogModel
	var total int64
	if err := r.db.WithContext(ctx).Model(&SpinLogModel{}).Where("player_id = ?", playerID).Count(&total).Error; err != nil {
		return nil, err
	}

	err := r.db.WithContext(ctx).
		Where("player_id = ?", playerID).
		Order("created_at DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&models).Error
	if err != nil {
		return nil, err
	}

	data := make([]*domain.SpinLogWithPlayer, len(models))
	for i, model := range models {
		spinLog, err := r.toDomain(model)
		if err != nil {
			return nil, err
		}
		data[i] = &domain.SpinLogWithPlayer{
			SpinLog:        spinLog,
			PlayerNickname: "", // Not needed for personal history
		}
	}

	return &domain.SpinLogListResult{
		Data:   data,
		Total:  total,
		Limit:  params.Limit,
		Offset: params.Offset,
	}, nil
}

func (r *SpinLogRepositoryGorm) CountTodayByPlayer(ctx context.Context, playerID string) (int, error) {
	var count int64
	today := time.Now().Truncate(24 * time.Hour)
	tomorrow := today.Add(24 * time.Hour)
	err := r.db.WithContext(ctx).
		Model(&SpinLogModel{}).
		Where("player_id = ? AND created_at >= ? AND created_at < ?", playerID, today, tomorrow).
		Count(&count).Error
	return int(count), err
}

func (r *SpinLogRepositoryGorm) toModel(spinLog *domain.SpinLog) *SpinLogModel {
	return &SpinLogModel{
		ID:           spinLog.ID().String(),
		PlayerID:     spinLog.PlayerID(),
		PointsGained: spinLog.PointsGained(),
		Source:       string(spinLog.Source()),
		CreatedAt:    spinLog.CreatedAt(),
	}
}

func (r *SpinLogRepositoryGorm) toDomain(model *SpinLogModel) (*domain.SpinLog, error) {
	return domain.ReconstructSpinLog(
		model.ID,
		model.PlayerID,
		model.PointsGained,
		model.Source,
		model.CreatedAt,
	)
}
