package domain

import (
	shared "backend/internal/shared/domain"
	"errors"
	"time"
)

// Player is the aggregate root for player bounded context
type Player struct {
	id          *PlayerID
	nickname    *Nickname
	totalPoints *shared.Points
	createdAt   time.Time
	updatedAt   time.Time

	// Transient (not persisted)
	domainEvents []shared.DomainEvent
}

// NewPlayer creates a new player aggregate
func NewPlayer(id *PlayerID, nickname *Nickname) (*Player, error) {
	if id == nil {
		return nil, errors.New("player ID cannot be nil")
	}
	if nickname == nil {
		return nil, errors.New("nickname cannot be nil")
	}

	player := &Player{
		id:           id,
		nickname:     nickname,
		totalPoints:  nil, // Will be set below
		createdAt:    time.Now(),
		updatedAt:    time.Now(),
		domainEvents: []shared.DomainEvent{},
	}

	// Initialize points
	points, err := shared.NewPoints(0)
	if err != nil {
		return nil, err
	}
	player.totalPoints = points

	// Emit creation event
	player.domainEvents = append(player.domainEvents, NewPlayerCreatedEvent(id.String(), nickname.String()))

	if err := player.IsValid(); err != nil {
		return nil, err
	}

	return player, nil
}

// ReconstructPlayer rebuilds player from persistence (no events emitted)
func ReconstructPlayer(id *PlayerID, nickname *Nickname, points *shared.Points, createdAt, updatedAt time.Time) *Player {
	return &Player{
		id:           id,
		nickname:     nickname,
		totalPoints:  points,
		createdAt:    createdAt,
		updatedAt:    updatedAt,
		domainEvents: []shared.DomainEvent{},
	}
}

// Accessors (read-only)
func (p *Player) ID() *PlayerID {
	return p.id
}

func (p *Player) Nickname() *Nickname {
	return p.nickname
}

func (p *Player) TotalPoints() *shared.Points {
	return p.totalPoints
}

func (p *Player) CreatedAt() time.Time {
	return p.createdAt
}

func (p *Player) UpdatedAt() time.Time {
	return p.updatedAt
}

// Business behavior
func (p *Player) AddPoints(amount *shared.Points) error {
	if amount == nil {
		return errors.New("points amount cannot be nil")
	}
	if amount.Value() < 0 {
		return errors.New("cannot add negative points")
	}

	newTotal := p.totalPoints.Value() + amount.Value()
	newPoints, err := shared.NewPoints(newTotal)
	if err != nil {
		return err
	}
	p.totalPoints = newPoints
	p.updatedAt = time.Now()

	// Emit points added event
	p.domainEvents = append(p.domainEvents, NewPointsAddedEvent(p.id.String(), amount.Value(), newTotal))

	return nil
}

func (p *Player) Enter() {
	p.updatedAt = time.Now()

	// Emit entered event
	p.domainEvents = append(p.domainEvents, NewPlayerEnteredEvent(p.id.String()))
}

// Event management
func (p *Player) DomainEvents() []shared.DomainEvent {
	return p.domainEvents
}

func (p *Player) ClearEvents() {
	p.domainEvents = []shared.DomainEvent{}
}

// Validation
func (p *Player) IsValid() error {
	if p.id == nil || p.id.IsZero() {
		return errors.New("player ID is required")
	}
	if p.nickname == nil {
		return errors.New("nickname is required")
	}
	if p.totalPoints == nil {
		return errors.New("total points cannot be nil")
	}
	if p.totalPoints.Value() < 0 {
		return errors.New("total points cannot be negative")
	}
	return nil
}
