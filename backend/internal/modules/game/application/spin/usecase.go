package spin

import (
	"context"
	"errors"

	"backend/internal/modules/game/application"
	gamedomain "backend/internal/modules/game/domain"
	historydomain "backend/internal/modules/history/domain"
	playerdomain "backend/internal/modules/player/domain"
	"backend/internal/shared/constants"
)

var (
	ErrDailyLimitExceeded = errors.New("daily spin limit exceeded")
)

// SpinLogDailyLimitChecker adapter to check daily spins
type SpinLogDailyLimitChecker struct {
	spinLogRepo historydomain.SpinLogRepository
}

// NewSpinLogDailyLimitChecker creates a new checker
func NewSpinLogDailyLimitChecker(repo historydomain.SpinLogRepository) *SpinLogDailyLimitChecker {
	return &SpinLogDailyLimitChecker{spinLogRepo: repo}
}

// CountTodaySpins implements DailySpinLimitChecker
func (c *SpinLogDailyLimitChecker) CountTodaySpins(ctx context.Context, playerID string) (int, error) {
	return c.spinLogRepo.CountTodayByPlayer(ctx, playerID)
}

// ExecuteSpinUseCase handles spin execution
type ExecuteSpinUseCase struct {
	playerRepo  playerdomain.PlayerRepository
	spinLogRepo historydomain.SpinLogRepository
	spinService *gamedomain.SpinDomainService
	dailyLimit  *gamedomain.DailyLimitSpec
}

// NewExecuteSpinUseCase creates a new use case
func NewExecuteSpinUseCase(
	playerRepo playerdomain.PlayerRepository,
	spinLogRepo historydomain.SpinLogRepository,
	spinService *gamedomain.SpinDomainService,
	dailyLimit *gamedomain.DailyLimitSpec,
) *ExecuteSpinUseCase {
	return &ExecuteSpinUseCase{
		playerRepo:  playerRepo,
		spinLogRepo: spinLogRepo,
		spinService: spinService,
		dailyLimit:  dailyLimit,
	}
}

// Execute performs a spin for the player
// 1. Parse player ID
// 2. Get player
// 3. Check daily limit
// 4. Execute spin (weighted random)
// 5. Add points to player
// 6. Update player
// 7. Create spin log
// 8. Return result
func (uc *ExecuteSpinUseCase) Execute(ctx context.Context, req application.SpinRequest) (*application.SpinResponse, error) {
	// 1. Parse player ID
	playerID, err := playerdomain.NewPlayerID(req.PlayerID)
	if err != nil {
		return nil, errors.New("invalid player ID")
	}

	// 2. Get player
	player, err := uc.playerRepo.FindByID(ctx, playerID)
	if err != nil {
		return nil, errors.New("player not found")
	}

	// 3. Check daily limit
	canSpin, err := uc.dailyLimit.IsSatisfied(ctx, playerID.String())
	if err != nil {
		return nil, err
	}
	if !canSpin {
		return nil, ErrDailyLimitExceeded
	}

	// 4. Execute spin (weighted random)
	pointsGained, err := uc.spinService.Spin()
	if err != nil {
		return nil, err
	}

	// 5. Add points to player
	err = player.AddPoints(pointsGained)
	if err != nil {
		return nil, err
	}

	// 6. Update player
	err = uc.playerRepo.Update(ctx, player)
	if err != nil {
		return nil, err
	}

	// 7. Create spin log
	spinLog, err := historydomain.NewSpinLog(
		playerID.String(),
		pointsGained.Value(),
		constants.SpinSourceGame,
	)
	if err != nil {
		return nil, err
	}

	err = uc.spinLogRepo.Store(ctx, spinLog)
	if err != nil {
		return nil, err
	}

	// 8. Return result
	return &application.SpinResponse{
		SpinID:           spinLog.ID().String(),
		PointsGained:     pointsGained.Value(),
		TotalPointsAfter: player.TotalPoints().Value(),
	}, nil
}
