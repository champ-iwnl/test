package player

import (
	"backend/internal/infrastructure/config"
	"backend/internal/modules/player/adapter/handler"
	"backend/internal/modules/player/adapter/repository"
	"backend/internal/modules/player/application/enter"
	"backend/internal/modules/player/application/get_profile"
	"backend/internal/modules/player/domain"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// Module wires all player dependencies
type Module struct {
	Handler *handler.PlayerHandler
}

func NewModule(db *gorm.DB, cfg *config.Config) *Module {
	// Create factory with config
	factory := domain.NewPlayerFactory(
		cfg.Validation.Nickname.MinLength,
		cfg.Validation.Nickname.MaxLength,
	)

	// Create repository
	repo := repository.NewPlayerRepositoryGorm(db, factory)

	// Create usecases
	enterUC := enter.New(repo, factory)
	getProfileUC := get_profile.New(repo)

	// Create handler
	h := handler.NewPlayerHandler(enterUC, getProfileUC)

	return &Module{Handler: h}
}

func (m *Module) RegisterRoutes(app *fiber.App) {
	m.Handler.RegisterRoutes(app)
}
