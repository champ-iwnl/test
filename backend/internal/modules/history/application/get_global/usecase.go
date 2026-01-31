package get_global

import (
	"backend/internal/infrastructure/config"
	"backend/internal/modules/history/application"
	"backend/internal/modules/history/domain"
	shared "backend/internal/shared/domain"
	"context"
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

func (uc *UseCase) Execute(ctx context.Context, req application.GetGlobalRequest) (*application.GlobalHistoryResponse, error) {
	params := shared.NewPaginationParams(req.Limit, req.Offset, shared.PaginationConfig{
		DefaultLimit:  uc.paginationCfg.DefaultLimit,
		MaxLimit:      uc.paginationCfg.MaxLimit,
		DefaultOffset: uc.paginationCfg.DefaultOffset,
	})
	result, err := uc.spinLogRepo.ListAll(ctx, params)
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
		Data:   dtos,
		Total:  result.Total,
		Limit:  result.Limit,
		Offset: result.Offset,
	}, nil
}
