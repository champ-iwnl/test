package handler

import (
	"backend/internal/modules/game/application"
	"backend/internal/modules/game/application/spin"

	"github.com/gofiber/fiber/v2"
)

// GameHandler handles game requests
type GameHandler struct {
	executeSpinUC *spin.ExecuteSpinUseCase
}

// NewGameHandler creates a new handler
func NewGameHandler(executeSpinUC *spin.ExecuteSpinUseCase) *GameHandler {
	return &GameHandler{
		executeSpinUC: executeSpinUC,
	}
}

// Spin godoc
// @Summary      Execute a spin
// @Description  Perform a spin for the player (max 10 spins/day)
// @Tags         Game
// @Accept       json
// @Produce      json
// @Param        request body application.SpinRequest true "Spin request"
// @Success      200 {object} application.SpinResponse
// @Failure      400 {object} application.SpinErrorResponse "Invalid request"
// @Failure      404 {object} application.SpinErrorResponse "Player not found"
// @Failure      429 {object} application.SpinErrorResponse "Daily limit exceeded"
// @Failure      500 {object} application.SpinErrorResponse "Internal server error"
// @Router       /game/spin [post]
func (h *GameHandler) Spin(c *fiber.Ctx) error {
	var req application.SpinRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(application.SpinErrorResponse{
			Code:    "INVALID_REQUEST",
			Message: err.Error(),
		})
	}

	resp, err := h.executeSpinUC.Execute(c.Context(), req)
	if err != nil {
		// Handle specific errors
		if err.Error() == "player not found" {
			return c.Status(fiber.StatusNotFound).JSON(application.SpinErrorResponse{
				Code:    "PLAYER_NOT_FOUND",
				Message: "Player not found",
			})
		}
		if err == spin.ErrDailyLimitExceeded {
			return c.Status(fiber.StatusTooManyRequests).JSON(application.SpinErrorResponse{
				Code:           "DAILY_LIMIT_EXCEEDED",
				Message:        "Daily spin limit reached",
				RemainingSpins: intPtr(0),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(application.SpinErrorResponse{
			Code:    "INTERNAL_ERROR",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func intPtr(val int) *int {
	return &val
}
