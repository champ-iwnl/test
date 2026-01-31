package handler

import "github.com/gofiber/fiber/v2"

func (h *HistoryHandler) RegisterRoutes(app *fiber.App) {
	history := app.Group("/history")
	history.Get("/global", h.GetGlobal)
	history.Get("/:player_id", h.GetPersonal)
}
