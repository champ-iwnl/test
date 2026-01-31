package domain

import "context"

// PlayerRepository defines persistence contract
// Defined in domain, implemented in adapter
type PlayerRepository interface {
	// Store stores a new player
	Store(ctx context.Context, player *Player) error

	// FindByID loads player by ID
	FindByID(ctx context.Context, id *PlayerID) (*Player, error)

	// FindByNickname loads player by nickname
	FindByNickname(ctx context.Context, nickname *Nickname) (*Player, error)

	// Update persists changes to existing player
	Update(ctx context.Context, player *Player) error

	// ExistsByNickname checks if nickname is taken
	ExistsByNickname(ctx context.Context, nickname *Nickname) (bool, error)
}