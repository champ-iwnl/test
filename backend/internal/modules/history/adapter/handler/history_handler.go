package handler

import (
	"backend/internal/modules/history/application"
	"backend/internal/modules/history/application/get_global"
	"backend/internal/modules/history/application/get_personal"
	"backend/internal/shared/constants"
	httputil "backend/internal/shared/http"

	"github.com/gofiber/fiber/v2"
)

type HistoryHandler struct {
	getGlobalUC   *get_global.UseCase
	getPersonalUC *get_personal.UseCase
}

func NewHistoryHandler(
	getGlobalUC *get_global.UseCase,
	getPersonalUC *get_personal.UseCase,
) *HistoryHandler {
	return &HistoryHandler{
		getGlobalUC:   getGlobalUC,
		getPersonalUC: getPersonalUC,
	}
}

// GetGlobal handles GET /history/global
// @Summary Get global spin history
// @Description Get paginated global spin history with player nicknames
// @Tags History
// @Accept json
// @Produce json
// @Param limit query int false "Number of items per page" default(20)
// @Param offset query int false "Number of items to skip" default(0)
// @Success 200 {object} application.GlobalHistoryResponse
// @Failure 400 {object} object
// @Failure 500 {object} object
// @Router /history/global [get]
func (h *HistoryHandler) GetGlobal(c *fiber.Ctx) error {
	var req application.GetGlobalRequest
	if err := c.QueryParser(&req); err != nil {
		return httputil.BadRequest(c, constants.ErrCodeValidationFailed, "Invalid query parameters")
	}

	resp, err := h.getGlobalUC.Execute(c.Context(), req)
	if err != nil {
		return httputil.Error(c, constants.StatusInternalServerError, "INTERNAL_ERROR", "Failed to get global history")
	}

	return c.JSON(resp)
}

// GetPersonal handles GET /history/:player_id
// @Summary Get personal spin history
// @Description Get paginated spin history for a specific player
// @Tags History
// @Accept json
// @Produce json
// @Param player_id path string true "Player ID"
// @Param limit query int false "Number of items per page" default(20)
// @Param offset query int false "Number of items to skip" default(0)
// @Success 200 {object} application.PersonalHistoryResponse
// @Failure 400 {object} object
// @Failure 404 {object} object
// @Failure 500 {object} object
// @Router /history/{player_id} [get]
func (h *HistoryHandler) GetPersonal(c *fiber.Ctx) error {
	var req application.GetPersonalRequest
	if err := c.ParamsParser(&req); err != nil {
		return httputil.BadRequest(c, constants.ErrCodeValidationFailed, "Invalid path parameters")
	}
	if err := c.QueryParser(&req); err != nil {
		return httputil.BadRequest(c, constants.ErrCodeValidationFailed, "Invalid query parameters")
	}

	resp, err := h.getPersonalUC.Execute(c.Context(), req)
	if err != nil {
		return httputil.Error(c, constants.StatusInternalServerError, "INTERNAL_ERROR", "Failed to get personal history")
	}

	return c.JSON(resp)
}
