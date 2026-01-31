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
// @Summary Enter or resume a player
// @Description Enter an existing player or create a new one with the given nickname
// @Tags Players
// @Accept json
// @Produce json
// @Param request body application.EnterRequest true "Player enter request"
// @Success 200 {object} application.EnterResponse "Existing player found"
// @Success 201 {object} application.EnterResponse "New player created"
// @Failure 400 {object} object "Bad request"
// @Failure 500 {object} object "Internal server error"
// @Router /players/enter [post]
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
// @Summary Get player profile
// @Description Get player profile information by player ID
// @Tags Players
// @Accept json
// @Produce json
// @Param id path string true "Player ID"
// @Success 200 {object} application.ProfileResponse "Player profile"
// @Failure 400 {object} object "Bad request"
// @Failure 404 {object} object "Player not found"
// @Failure 500 {object} object "Internal server error"
// @Router /players/{id} [get]
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
