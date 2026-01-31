package handler

import "github.com/gofiber/fiber/v2"

// RegisterRoutes registers player routes
func (h *PlayerHandler) RegisterRoutes(app *fiber.App) {
	players := app.Group("/players")

	players.Post("/enter", h.Enter)
	players.Get("/:id", h.GetProfile)
}
