package get_global

import (
	"context"

	"backend/internal/modules/history/application"
	"backend/internal/modules/history/domain"
	shared "backend/internal/shared/domain"
)

type UseCase struct {
	spinLogRepo   domain.SpinLogRepository
	paginationCfg shared.PaginationConfig
}

func New(repo domain.SpinLogRepository, cfg shared.PaginationConfig) *UseCase {
	return &UseCase{
		spinLogRepo:   repo,
		paginationCfg: cfg,
	}
}

// Execute handles cursor-based pagination
func (uc *UseCase) Execute(ctx context.Context, req application.GetGlobalRequest) (*application.GlobalHistoryResponse, error) {
	params := shared.NewCursorParams(req.Limit, req.Cursor, uc.paginationCfg)
	result, err := uc.spinLogRepo.ListAllCursor(ctx, params)
	if err != nil {
		return nil, err
	}

	dtos := make([]application.GlobalSpinLogDTO, len(result.Data))
	for i, item := range result.Data {
		dtos[i] = application.GlobalSpinLogDTO{
			ID:             item.SpinLog.ID().String(),
			PlayerNickname: item.PlayerNickname,
			PointsGained:   item.SpinLog.PointsGained(),
			Source:         string(item.SpinLog.Source()),
			CreatedAt:      item.SpinLog.CreatedAt(),
		}
	}

	return &application.GlobalHistoryResponse{
		Data:       dtos,
		NextCursor: result.NextCursor,
		HasMore:    result.HasMore,
	}, nil
}
