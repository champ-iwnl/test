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
