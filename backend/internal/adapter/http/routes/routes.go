package routes

import (
	"backend/internal/infrastructure/config"
	"backend/internal/modules/game"
	"backend/internal/modules/history"
	"backend/internal/modules/player"
	"backend/internal/modules/reward"

	"github.com/gofiber/fiber/v2"
	fiberSwagger "github.com/swaggo/fiber-swagger"
	"gorm.io/gorm"
)

func Setup(app *fiber.App, db *gorm.DB, cfg *config.Config) {
	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Server is running",
		})
	})

	// Database health check
	app.Get("/health/db", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":   "ok",
			"database": "connected",
		})
	})

	// API info
	app.Get("/api/info", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"name":         "Spin Head API",
			"version":      "1.0.0",
			"architecture": "Full DDD + Clean Architecture",
		})
	})

	// Swagger documentation
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	// Initialize modules (order matters for dependency injection)
	playerModule := player.NewModule(db, cfg, nil)
	historyModule := history.NewModule(db, cfg)
	rewardModule := reward.NewModule(db, cfg, playerModule.PlayerRepo)

	// Initialize game module (needs player and spin log repos)
	sqlDB, err := db.DB()
	if err != nil {
		panic("Failed to get SQL DB: " + err.Error())
	}
	gameModule, err := game.NewModule(cfg, sqlDB, playerModule.PlayerRepo, historyModule.SpinLogRepo)
	if err != nil {
		panic("Failed to initialize game module: " + err.Error())
	}

	// Register routes
	playerModule.RegisterRoutes(app)
	historyModule.RegisterRoutes(app)
	rewardModule.RegisterRoutes(app)
	gameModule.RegisterRoutes(app)

	// Update player module with reward repository for profile
	playerModuleWithRewards := player.NewModule(db, cfg, rewardModule.RewardTxRepo)
	playerModuleWithRewards.RegisterRoutes(app)
}
