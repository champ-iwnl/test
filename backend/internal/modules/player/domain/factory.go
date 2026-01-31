package domain

import (
	shared "backend/internal/shared/domain"
	"time"
)

// PlayerFactory creates Player aggregates
type PlayerFactory struct {
	NicknameMinLen int
	NicknameMaxLen int
}

func NewPlayerFactory(minLen, maxLen int) *PlayerFactory {
	return &PlayerFactory{
		NicknameMinLen: minLen,
		NicknameMaxLen: maxLen,
	}
}

// CreateNewPlayer creates a brand new player
func (f *PlayerFactory) CreateNewPlayer(nickname string) (*Player, error) {
	playerID := GeneratePlayerID()
	nicknameVO, err := NewNickname(nickname, f.NicknameMinLen, f.NicknameMaxLen)
	if err != nil {
		return nil, err
	}

	return NewPlayer(playerID, nicknameVO)
}

// ReconstructPlayer rebuilds from persistence (no events emitted)
func (f *PlayerFactory) ReconstructPlayer(
	id string,
	nickname string,
	totalPoints int,
	createdAt, updatedAt time.Time,
) (*Player, error) {
	playerID, err := NewPlayerID(id)
	if err != nil {
		return nil, err
	}

	nicknameVO, err := NewNickname(nickname, f.NicknameMinLen, f.NicknameMaxLen)
	if err != nil {
		return nil, err
	}

	points, err := shared.NewPoints(totalPoints)
	if err != nil {
		return nil, err
	}

	return ReconstructPlayer(playerID, nicknameVO, points, createdAt, updatedAt), nil
}
