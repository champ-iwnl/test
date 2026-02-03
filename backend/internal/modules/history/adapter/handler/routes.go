package handler

import "github.com/gofiber/fiber/v2"

func (h *HistoryHandler) RegisterRoutes(app *fiber.App) {
	history := app.Group("/history")

	// Global history (cursor-based)
	history.Get("/global", h.GetGlobal)

	// Personal history (cursor-based) - must be after /global to avoid conflicts
	history.Get("/:player_id", h.GetPersonal)
}
