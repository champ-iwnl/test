package get_personal

import (
	"backend/internal/infrastructure/config"
	"backend/internal/modules/history/application"
	"backend/internal/modules/history/domain"
	shared "backend/internal/shared/domain"
	"context"
	"errors"
)

type UseCase struct {
	spinLogRepo   domain.SpinLogRepository
	paginationCfg *config.PaginationConfig
}

func New(repo domain.SpinLogRepository, cfg *config.PaginationConfig) *UseCase {
	return &UseCase{
		spinLogRepo:   repo,
		paginationCfg: cfg,
	}
}

// Execute handles cursor-based pagination
func (uc *UseCase) Execute(ctx context.Context, req application.GetPersonalRequest) (*application.PersonalHistoryResponse, error) {
	if req.PlayerID == "" {
		return nil, errors.New("player ID is required")
	}

	params := shared.NewCursorParams(req.Limit, req.Cursor, shared.PaginationConfig{
		DefaultLimit:  uc.paginationCfg.DefaultLimit,
		MaxLimit:      uc.paginationCfg.MaxLimit,
		DefaultOffset: uc.paginationCfg.DefaultOffset,
	})
	result, err := uc.spinLogRepo.ListByPlayerCursor(ctx, req.PlayerID, params)
	if err != nil {
		return nil, err
	}

	dtos := make([]application.PersonalSpinLogDTO, len(result.Data))
	for i, item := range result.Data {
		dtos[i] = application.PersonalSpinLogDTO{
			ID:           item.SpinLog.ID().String(),
			PointsGained: item.SpinLog.PointsGained(),
			Source:       string(item.SpinLog.Source()),
			CreatedAt:    item.SpinLog.CreatedAt(),
		}
	}

	return &application.PersonalHistoryResponse{
		Data:       dtos,
		NextCursor: result.NextCursor,
		HasMore:    result.HasMore,
	}, nil
}
