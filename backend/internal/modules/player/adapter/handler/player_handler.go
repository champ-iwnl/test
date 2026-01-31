package handler

import (
	"backend/internal/modules/player/application"
	"backend/internal/modules/player/application/enter"
	"backend/internal/modules/player/application/get_profile"
	"backend/internal/shared/constants"
	shared "backend/internal/shared/domain"
	httputil "backend/internal/shared/http"

	"github.com/gofiber/fiber/v2"
)

type PlayerHandler struct {
	enterUC      *enter.UseCase
	getProfileUC *get_profile.UseCase
}

func NewPlayerHandler(enterUC *enter.UseCase, getProfileUC *get_profile.UseCase) *PlayerHandler {
	return &PlayerHandler{
		enterUC:      enterUC,
		getProfileUC: getProfileUC,
	}
}

// Enter handles POST /players/enter
func (h *PlayerHandler) Enter(c *fiber.Ctx) error {
	// Parse request body
	var req application.EnterRequest
	if err := c.BodyParser(&req); err != nil {
		return httputil.BadRequest(c, constants.ErrCodeValidationFailed, "Invalid request body")
	}

	// Execute usecase
	resp, err := h.enterUC.Execute(c.Context(), req)
	if err != nil {
		return httputil.Error(c, constants.StatusInternalServerError, "INTERNAL_ERROR", "Failed to enter player")
	}

	// Return response with appropriate status (200 or 201)
	status := fiber.StatusOK
	if resp.IsNew {
		status = fiber.StatusCreated
	}

	return c.Status(status).JSON(resp)
}

// GetProfile handles GET /players/:id
func (h *PlayerHandler) GetProfile(c *fiber.Ctx) error {
	// Parse player ID from URL
	playerID := c.Params("id")
	if playerID == "" {
		return httputil.BadRequest(c, constants.ErrCodeValidationFailed, "Player ID is required")
	}

	req := application.GetProfileRequest{
		PlayerID: playerID,
	}

	// Execute usecase
	resp, err := h.getProfileUC.Execute(c.Context(), req)
	if err != nil {
		if err == shared.ErrPlayerNotFound {
			return httputil.NotFound(c, constants.ErrCodePlayerNotFound, "Player not found")
		}
		return httputil.Error(c, constants.StatusInternalServerError, "INTERNAL_ERROR", "Failed to get player profile")
	}

	// Return response
	return c.JSON(resp)
}
