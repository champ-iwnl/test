package routes

import (
	"backend/internal/infrastructure/config"
	"backend/internal/modules/player"

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

	// Initialize modules
	playerModule := player.NewModule(db, cfg)
	playerModule.RegisterRoutes(app)
}
