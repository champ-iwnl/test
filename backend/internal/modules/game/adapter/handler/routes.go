package handler

import (
	"github.com/gofiber/fiber/v2"
)

// RegisterRoutes registers game routes
func RegisterRoutes(router fiber.Router, handler *GameHandler) {
	game := router.Group("/game")
	game.Post("/spin", handler.Spin)
}
