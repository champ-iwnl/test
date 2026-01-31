package enter

import (
	"backend/internal/modules/player/application"
	"backend/internal/modules/player/domain"
	shared "backend/internal/shared/domain"
	"context"
	"errors"
)

// UseCase handles player enter/resume
type UseCase struct {
	playerRepo    domain.PlayerRepository
	playerFactory *domain.PlayerFactory
}

func New(repo domain.PlayerRepository, factory *domain.PlayerFactory) *UseCase {
	return &UseCase{
		playerRepo:    repo,
		playerFactory: factory,
	}
}

// Execute enters existing player or creates new one
func (uc *UseCase) Execute(ctx context.Context, req application.EnterRequest) (*application.EnterResponse, error) {
	// Validate request
	if req.Nickname == "" {
		return nil, errors.New("nickname is required")
	}

	// Create nickname VO for searching
	nicknameVO, err := domain.NewNickname(req.Nickname, uc.playerFactory.NicknameMinLen, uc.playerFactory.NicknameMaxLen)
	if err != nil {
		return nil, err
	}

	// Try to find existing player by nickname
	existingPlayer, err := uc.playerRepo.FindByNickname(ctx, nicknameVO)
	if err != nil && !errors.Is(err, shared.ErrPlayerNotFound) {
		return nil, err
	}

	// If player exists, return existing player
	if existingPlayer != nil {
		existingPlayer.Enter() // Record entry
		err = uc.playerRepo.Update(ctx, existingPlayer)
		if err != nil {
			return nil, err
		}

		return &application.EnterResponse{
			ID:          existingPlayer.ID().String(),
			Nickname:    existingPlayer.Nickname().String(),
			TotalPoints: existingPlayer.TotalPoints().Value(),
			CreatedAt:   existingPlayer.CreatedAt(),
			IsNew:       false,
		}, nil
	}

	// Create new player
	newPlayer, err := uc.playerFactory.CreateNewPlayer(req.Nickname)
	if err != nil {
		return nil, err
	}

	err = uc.playerRepo.Store(ctx, newPlayer)
	if err != nil {
		return nil, err
	}

	return &application.EnterResponse{
		ID:          newPlayer.ID().String(),
		Nickname:    newPlayer.Nickname().String(),
		TotalPoints: newPlayer.TotalPoints().Value(),
		CreatedAt:   newPlayer.CreatedAt(),
		IsNew:       true,
	}, nil
}
