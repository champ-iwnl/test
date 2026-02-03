package game

import (
	"database/sql"

	"backend/internal/infrastructure/config"
	"backend/internal/modules/game/adapter/handler"
	"backend/internal/modules/game/application/spin"
	"backend/internal/modules/game/domain"
	historydomain "backend/internal/modules/history/domain"
	playerdomain "backend/internal/modules/player/domain"

	"github.com/gofiber/fiber/v2"
)

// Module encapsulates game module dependencies
type Module struct {
	Handler *handler.GameHandler
}

// NewModule initializes game module
func NewModule(
	cfg *config.Config,
	db *sql.DB,
	playerRepo playerdomain.PlayerRepository,
	spinLogRepo historydomain.SpinLogRepository,
) (*Module, error) {
	// Convert config items to domain items (keeps domain pure)
	domainItems := make([]domain.SpinDistributionItem, len(cfg.Game.Spin.Distribution))
	for i, item := range cfg.Game.Spin.Distribution {
		domainItems[i] = domain.SpinDistributionItem{
			Points: item.Points,
			Weight: item.Weight,
		}
	}

	// Create spin distribution from domain items
	spinDist, err := domain.NewSpinDistribution(domainItems)
	if err != nil {
		return nil, err
	}

	// Create random generator
	randomGen := domain.NewDefaultRandomGenerator()

	// Create spin service
	spinService := domain.NewSpinDomainService(spinDist, randomGen)

	// Create daily limit checker
	limitChecker := spin.NewSpinLogDailyLimitChecker(spinLogRepo)
	dailyLimit := domain.NewDailyLimitSpec(cfg.Game.Spin.MaxDailySpins, limitChecker)

	// Create use case
	executeSpinUC := spin.NewExecuteSpinUseCase(playerRepo, spinLogRepo, spinService, dailyLimit)

	// Create handler
	gameHandler := handler.NewGameHandler(executeSpinUC)

	return &Module{
		Handler: gameHandler,
	}, nil
}

// RegisterRoutes registers game routes
func (m *Module) RegisterRoutes(router fiber.Router) {
	handler.RegisterRoutes(router, m.Handler)
}
