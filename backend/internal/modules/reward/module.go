package reward

import (
	"gorm.io/gorm"

	"github.com/gofiber/fiber/v2"

	"backend/internal/infrastructure/config"
	playerdomain "backend/internal/modules/player/domain"
	"backend/internal/modules/reward/adapter/handler"
	"backend/internal/modules/reward/adapter/repository"
	"backend/internal/modules/reward/application/claim"
	"backend/internal/modules/reward/application/get_history"
	"backend/internal/modules/reward/domain"
)

// Module represents the reward module
type Module struct {
	Handler          *handler.RewardHandler
	RewardConfigRepo domain.RewardConfigRepository
	RewardTxRepo     domain.RewardTransactionRepository
}

// NewModule creates a new reward module
func NewModule(
	db *gorm.DB,
	cfg *config.Config,
	playerRepo playerdomain.PlayerRepository,
) *Module {
	configRepo := repository.NewRewardConfigRepositoryGorm(db)
	txRepo := repository.NewRewardTransactionRepositoryGorm(db)

	claimUC := claim.New(txRepo, configRepo, playerRepo)
	getHistoryUC := get_history.New(txRepo)

	h := handler.NewRewardHandler(claimUC, getHistoryUC)

	return &Module{
		Handler:          h,
		RewardConfigRepo: configRepo,
		RewardTxRepo:     txRepo,
	}
}

// RegisterRoutes registers reward routes
func (m *Module) RegisterRoutes(app *fiber.App) {
	m.Handler.RegisterRoutes(app)
}
