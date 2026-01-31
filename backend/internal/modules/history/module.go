package history

import (
	"backend/internal/infrastructure/config"
	"backend/internal/modules/history/adapter/handler"
	"backend/internal/modules/history/adapter/repository"
	"backend/internal/modules/history/application/get_global"
	"backend/internal/modules/history/application/get_personal"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type Module struct {
	Handler     *handler.HistoryHandler
	SpinLogRepo *repository.SpinLogRepositoryGorm // Exported for Game module
}

func NewModule(db *gorm.DB, cfg *config.Config) *Module {
	repo := repository.NewSpinLogRepositoryGorm(db)

	getGlobalUC := get_global.New(repo, &cfg.Pagination)
	getPersonalUC := get_personal.New(repo, &cfg.Pagination)

	h := handler.NewHistoryHandler(getGlobalUC, getPersonalUC)

	return &Module{
		Handler:     h,
		SpinLogRepo: repo,
	}
}

func (m *Module) RegisterRoutes(app *fiber.App) {
	m.Handler.RegisterRoutes(app)
}
