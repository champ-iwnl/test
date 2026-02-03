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

// ========== Cursor-based Pagination Methods ==========

func (r *SpinLogRepositoryGorm) ListAllCursor(ctx context.Context, params shared.CursorParams) (*domain.SpinLogCursorResult, error) {
	var models []*SpinLogModel

	query := r.db.WithContext(ctx).
		Preload("Player").
		Order("created_at DESC, id DESC")

	// Apply cursor filter if provided
	cursorData, err := shared.DecodeCursor(params.Cursor)
	if err != nil {
		return nil, err
	}
	if cursorData != nil {
		// Seek to position after cursor using composite comparison
		query = query.Where(
			"(created_at < ?) OR (created_at = ? AND id < ?)",
			cursorData.CreatedAt, cursorData.CreatedAt, cursorData.ID,
		)
	}

	// Fetch limit+1 to check if there are more results
	err = query.Limit(params.Limit + 1).Find(&models).Error
	if err != nil {
		return nil, err
	}

	hasMore := len(models) > params.Limit
	if hasMore {
		models = models[:params.Limit] // Trim extra item
	}

	data := make([]*domain.SpinLogWithPlayer, len(models))
	var nextCursor string
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
		// Generate cursor from last item
		if i == len(models)-1 && hasMore {
			nextCursor = shared.EncodeCursor(model.CreatedAt, model.ID)
		}
	}

	return &domain.SpinLogCursorResult{
		Data:       data,
		NextCursor: nextCursor,
		HasMore:    hasMore,
	}, nil
}

func (r *SpinLogRepositoryGorm) ListByPlayerCursor(ctx context.Context, playerID string, params shared.CursorParams) (*domain.SpinLogCursorResult, error) {
	var models []*SpinLogModel

	query := r.db.WithContext(ctx).
		Where("player_id = ?", playerID).
		Order("created_at DESC, id DESC")

	// Apply cursor filter if provided
	cursorData, err := shared.DecodeCursor(params.Cursor)
	if err != nil {
		return nil, err
	}
	if cursorData != nil {
		query = query.Where(
			"(created_at < ?) OR (created_at = ? AND id < ?)",
			cursorData.CreatedAt, cursorData.CreatedAt, cursorData.ID,
		)
	}

	// Fetch limit+1 to check if there are more results
	err = query.Limit(params.Limit + 1).Find(&models).Error
	if err != nil {
		return nil, err
	}

	hasMore := len(models) > params.Limit
	if hasMore {
		models = models[:params.Limit]
	}

	data := make([]*domain.SpinLogWithPlayer, len(models))
	var nextCursor string
	for i, model := range models {
		spinLog, err := r.toDomain(model)
		if err != nil {
			return nil, err
		}
		data[i] = &domain.SpinLogWithPlayer{
			SpinLog:        spinLog,
			PlayerNickname: "",
		}
		if i == len(models)-1 && hasMore {
			nextCursor = shared.EncodeCursor(model.CreatedAt, model.ID)
		}
	}

	return &domain.SpinLogCursorResult{
		Data:       data,
		NextCursor: nextCursor,
		HasMore:    hasMore,
	}, nil
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
