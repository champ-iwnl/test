package handler

import "github.com/gofiber/fiber/v2"

// RegisterRoutes registers reward routes
func (h *RewardHandler) RegisterRoutes(app *fiber.App) {
	rewards := app.Group("/rewards")

	rewards.Post("/claim", h.Claim)
	rewards.Get("/:player_id", h.GetHistory)
}
