package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	"backend/internal/modules/reward/application"
	"backend/internal/modules/reward/application/claim"
	"backend/internal/modules/reward/application/get_history"
	"backend/internal/shared/constants"
	shared "backend/internal/shared/domain"
	httputil "backend/internal/shared/http"
)

type RewardHandler struct {
	claimUC      *claim.UseCase
	getHistoryUC *get_history.UseCase
}

// NewRewardHandler creates a new reward handler
func NewRewardHandler(claimUC *claim.UseCase, getHistoryUC *get_history.UseCase) *RewardHandler {
	return &RewardHandler{
		claimUC:      claimUC,
		getHistoryUC: getHistoryUC,
	}
}

// Claim handles POST /rewards/claim
// @Summary Claim reward at checkpoint
// @Description Claim a reward when player reaches a checkpoint
// @Tags Rewards
// @Accept json
// @Produce json
// @Param request body application.ClaimRequest true "Claim reward request"
// @Success 200 {object} application.ClaimResponse
// @Failure 400 {object} object "Insufficient points or invalid checkpoint"
// @Failure 404 {object} object "Player not found"
// @Failure 409 {object} object "Already claimed"
// @Failure 500 {object} object "Internal server error"
// @Router /rewards/claim [post]
func (h *RewardHandler) Claim(c *fiber.Ctx) error {
	// 1. Parse request body
	var req application.ClaimRequest
	if err := c.BodyParser(&req); err != nil {
		return httputil.BadRequest(c, constants.ErrCodeValidationFailed, "Invalid request body")
	}

	// 2. Execute usecase
	resp, err := h.claimUC.Execute(c.Context(), claim.Request{
		PlayerID:      req.PlayerID,
		CheckpointVal: req.CheckpointVal,
	})

	// 3. Handle errors
	if err != nil {
		if errors.Is(err, shared.ErrPlayerNotFound) {
			return httputil.NotFound(c, constants.ErrCodePlayerNotFound, "Player not found")
		}
		if errors.Is(err, shared.ErrInvalidCheckpoint) {
			return httputil.BadRequest(c, "INVALID_CHECKPOINT", "Invalid checkpoint value")
		}
		if errors.Is(err, shared.ErrInsufficientPoints) {
			return httputil.BadRequest(c, "INSUFFICIENT_POINTS", "Not enough points to claim this reward")
		}
		if errors.Is(err, shared.ErrAlreadyClaimed) {
			return httputil.Conflict(c, "ALREADY_CLAIMED", "Reward already claimed")
		}
		return httputil.Error(c, constants.StatusInternalServerError, "INTERNAL_ERROR", "Failed to claim reward")
	}

	// 4. Return success response
	return c.JSON(application.ClaimResponse{
		ID:            resp.ID,
		CheckpointVal: resp.CheckpointVal,
		RewardName:    resp.RewardName,
		ClaimedAt:     resp.ClaimedAt,
	})
}

// GetHistory handles GET /rewards/:player_id
// @Summary Get reward claim history
// @Description Get all rewards claimed by a player
// @Tags Rewards
// @Accept json
// @Produce json
// @Param player_id path string true "Player ID"
// @Success 200 {object} application.GetHistoryResponse
// @Failure 400 {object} object "Invalid player ID"
// @Failure 500 {object} object "Internal server error"
// @Router /rewards/{player_id} [get]
func (h *RewardHandler) GetHistory(c *fiber.Ctx) error {
	// 1. Parse player_id from URL
	playerID := c.Params("player_id")
	if playerID == "" {
		return httputil.BadRequest(c, constants.ErrCodeValidationFailed, "Player ID is required")
	}

	// 2. Execute usecase
	resp, err := h.getHistoryUC.Execute(c.Context(), get_history.Request{
		PlayerID: playerID,
	})
	if err != nil {
		return httputil.Error(c, constants.StatusInternalServerError, "INTERNAL_ERROR", "Failed to get reward history")
	}

	// 3. Map to response
	dtos := make([]application.RewardHistoryDTO, 0, len(resp.Data))
	for _, item := range resp.Data {
		dtos = append(dtos, application.RewardHistoryDTO{
			ID:                item.ID,
			CheckpointVal:     item.CheckpointVal,
			RewardName:        item.RewardName,
			RewardDescription: item.RewardDescription,
			ClaimedAt:         item.ClaimedAt,
		})
	}

	// 4. Return response
	return c.JSON(application.GetHistoryResponse{
		Data: dtos,
	})
}
