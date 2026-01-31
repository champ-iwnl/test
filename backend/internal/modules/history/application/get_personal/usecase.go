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

func (uc *UseCase) Execute(ctx context.Context, req application.GetPersonalRequest) (*application.PersonalHistoryResponse, error) {
	if req.PlayerID == "" {
		return nil, errors.New("player ID is required")
	}

	params := shared.NewPaginationParams(req.Limit, req.Offset, *uc.paginationCfg)
	result, err := uc.spinLogRepo.ListByPlayer(ctx, req.PlayerID, params)
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
		Data:   dtos,
		Total:  result.Total,
		Limit:  result.Limit,
		Offset: result.Offset,
	}, nil
}
