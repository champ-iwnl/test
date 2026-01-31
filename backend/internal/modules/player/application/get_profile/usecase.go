package get_profile

import (
	"backend/internal/modules/player/application"
	"backend/internal/modules/player/domain"
	shared "backend/internal/shared/domain"
	"context"
	"errors"
)

// UseCase handles get player profile
type UseCase struct {
	playerRepo domain.PlayerRepository
	// rewardRepo will be added in Phase 6
}

func New(repo domain.PlayerRepository) *UseCase {
	return &UseCase{
		playerRepo: repo,
	}
}

// Execute retrieves player profile
func (uc *UseCase) Execute(ctx context.Context, req application.GetProfileRequest) (*application.ProfileResponse, error) {
	// Validate request
	if req.PlayerID == "" {
		return nil, errors.New("player ID is required")
	}

	// Parse player ID
	playerID, err := domain.NewPlayerID(req.PlayerID)
	if err != nil {
		return nil, err
	}

	// Find player
	player, err := uc.playerRepo.FindByID(ctx, playerID)
	if err != nil {
		if errors.Is(err, shared.ErrPlayerNotFound) {
			return nil, shared.ErrPlayerNotFound
		}
		return nil, err
	}

	// TODO: In Phase 6, add claimed checkpoints from rewardRepo

	return &application.ProfileResponse{
		ID:                 player.ID().String(),
		Nickname:           player.Nickname().String(),
		TotalPoints:        player.TotalPoints().Value(),
		CreatedAt:          player.CreatedAt(),
		ClaimedCheckpoints: []int{}, // Phase 6: will be populated from rewardRepo
	}, nil
}
