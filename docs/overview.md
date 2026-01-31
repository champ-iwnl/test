# Project Overview (Full DDD + Clean Architecture)

> Stack: Go + GORM + PostgreSQL + Docker

This document describes the selected architecture: **Domain-Driven Design (Full) + Clean Architecture in a Modular Monolith**.

## Philosophy
- **Domain-First**: Model the ubiquitous language and business rules explicitly
- **Bounded Contexts**: Each business domain owns its model, language, and boundaries
- **Smart Aggregates**: Complex domain logic lives in aggregate roots and value objects
- **Event-Driven**: Domain events capture important business facts; enable analytics, notifications, audit trails without coupling
- **Immutable Value Objects**: Express domain concepts with type safety
- **Repository Pattern**: Abstract persistence; domain defines contracts, infrastructure implements
- **Go-Idiomatic**: Leverage interfaces only when multiple implementations exist; favor composition; minimize ceremony

## Objectives
- Domain model reflects business rules and constraints (not anemic models)
- Strong bounded context separation; each context owns its aggregate roots
- Explicit aggregate boundaries with invariant protection
- Value objects for identity and domain concepts (not stringly-typed primitives)
- Domain events as first-class business facts
- Repository interfaces defined in domain; implementations in infrastructure
- Clear boundaries: Domain → Application (Usecase) → Adapters → Infrastructure
- External dependencies only in outer layers; never in domain
- High testability via isolated aggregates and domain services
- Ubiquitous language enforcement in code

## Bounded Contexts & Core Concepts

A **Bounded Context** is an explicit boundary within which a ubiquitous language is consistent. Each context models its own domain, uses its own repository implementations, and communicates via domain events or anti-corruption layers.

### Full DDD Layering per Bounded Context

1) **Domain Layer** — The heart of the application
   - **Aggregate Roots** — Complex entities with state invariants (e.g., `Player`, `Reward`)
   - **Value Objects** — Immutable domain concepts (e.g., `PlayerID`, `Points`, `RewardStatus`)
   - **Domain Services** — Operations that don't belong to a single aggregate
   - **Repository Interfaces** — Contracts defined here; implementations live in infrastructure
   - **Domain Events** — Record important business facts; immutable
   - **Specifications** — Encapsulate query logic (e.g., "players with score > X")
   - **Factories** — Encapsulate complex aggregate creation logic

2) **Application Layer (Usecase)** — Transactional boundaries & orchestration
   - **Use Cases** — Coordinate domain objects, manage transactions
   - **Application Services** — Implement use cases (one service per operation)
   - **Command/Query Objects** — DTOs for request/response (not domain concepts)
   - **DTO Mappers** — Convert between domain and application layer
   - **Event Publishers** — Notify other bounded contexts of domain events

3) **Adapter/Interface Layer** — External boundaries
   - **HTTP Handlers** — Parse requests, delegate to application services, format responses
   - **Repository Implementations** — GORM-based, implement domain interfaces
   - **Event Adapters** — Translate domain events to external systems (RabbitMQ, Kafka, webhooks)
   - **Anti-Corruption Layer** — Isolate domain from third-party service models

4) **Infrastructure Layer** — Technical concerns
   - **Database Connection** — Connection pooling, migrations
   - **Configuration** — Environment variables, config files
   - **Logging & Observability** — Structured logging, tracing
   - **External Service Clients** — Payment gateways, notification services (behind interfaces)

### Shared & Cross-Cutting Concerns
- `internal/shared` — Shared domain primitives, base errors, utilities
- `internal/infrastructure` — DB/config/logger wiring
- `pkg/` — Reusable libraries (no framework deps)

## Recommended Folder Layout (Full DDD)

```
cmd/
├── api/main.go          # HTTP server entrypoint
└── worker/main.go       # Event processor entrypoint

internal/
├── shared/              # Cross-context primitives
│   ├── domain/
│   │   ├── value_objects.go      # Shared ValueObject base, ID types
│   │   ├── domain_event.go       # DomainEvent interface
│   │   └── errors.go             # Base domain errors
│   ├── application/
│   │   └── errors.go             # Base app errors, DTOs
│   └── http/
│       └── status.go             # HTTP status codes

├── infrastructure/      # Technical wiring
│   ├── database/
│   │   ├── connection.go
│   │   ├── migrations/
│   │   └── seed.go
│   ├── config/
│   │   └── config.go
│   ├── logger/
│   │   └── logger.go
│   ├── event_bus/       # Event publishing (Kafka, etc.)
│   │   ├── publisher.go
│   │   └── subscriber.go
│   └── external/        # Third-party service clients
│       ├── payment/
│       └── notification/

├── modules/
│   ├── player/          # Bounded Context: Player Management
│   │   ├── domain/
│   │   │   ├── aggregate_root.go     # Player aggregate root
│   │   │   ├── value_objects.go      # PlayerID, Nickname, Points
│   │   │   ├── repository.go         # PlayerRepository interface
│   │   │   ├── service.go            # PlayerDomainService (if needed)
│   │   │   ├── specification.go      # PlayerSpecification
│   │   │   ├── factory.go            # PlayerFactory
│   │   │   └── events.go             # PlayerEnteredEvent, PointsAddedEvent, etc.
│   │   │
│   │   ├── application/
│   │   │   ├── enter/
│   │   │   │   ├── enter.go          # EnterUseCase struct, Execute()
│   │   │   │   └── dto.go            # Request, Response, DTO mapper
│   │   │   ├── get_profile/
│   │   │   │   ├── profile.go
│   │   │   │   └── dto.go
│   │   │   └── add_points/
│   │   │       ├── add_points.go
│   │   │       └── dto.go
│   │   │
│   │   ├── adapter/
│   │   │   ├── repository/
│   │   │   │   └── player_repository_gorm.go  # Implements domain repo interface
│   │   │   ├── handler/
│   │   │   │   ├── player_handler.go
│   │   │   │   └── http.go                     # Route registration & DI
│   │   │   └── event_listener/
│   │   │       └── player_event_listener.go
│   │   │
│   │   └── module.go    # DI container for player context
│   │
│   ├── game/            # Bounded Context: Game Management
│   │   ├── domain/
│   │   │   ├── game.go
│   │   │   ├── value_objects.go      # GameID, SpinResult, WheelConfig
│   │   │   ├── repository.go
│   │   │   ├── factory.go
│   │   │   └── events.go
│   │   ├── application/
│   │   ├── adapter/
│   │   └── module.go
│   │
│   ├── reward/          # Bounded Context: Reward Management
│   │   ├── domain/
│   │   │   ├── reward.go
│   │   │   ├── value_objects.go      # RewardID, RewardType, RewardStatus
│   │   │   ├── repository.go
│   │   │   ├── factory.go
│   │   │   └── events.go
│   │   ├── application/
│   │   ├── adapter/
│   │   └── module.go
│   │
│   └── history/         # Bounded Context: History/Audit
│       ├── domain/
│       ├── application/
│       ├── adapter/
│       └── module.go

migrations/              # SQL migrations (versioned)
├── 001_create_players.sql
├── 002_create_games.sql
└── 003_create_rewards.sql

pkg/                     # Reusable libraries (no framework deps)
├── errors/
├── validator/
├── logger/
└── uuid/

configs/
├── app.yaml
├── database.yaml
└── event.yaml

deploy/
├── Dockerfile
├── docker-compose.yml
└── k8s/

docs/
├── bounded_contexts.md
├── ubiquitous_language.md
├── api_spec.md
├── erd.md
└── sequence_diagrams/

tests/
├── integration/
├── e2e/
└── fixtures/
```

## Clean Architecture Rules (Strict Boundaries)

1) **Domain Layer** — Pure business logic, zero external dependencies
   - No imports from GORM, HTTP, config, external services
   - Contains aggregates, value objects, domain services, repository interfaces
   - Can be tested in isolation with zero infrastructure

2) **Application Layer** — Use cases & orchestration, minimal domain knowledge
   - Can import domain layer only
   - Cannot import infrastructure directly
   - Manages transaction boundaries
   - Calls domain aggregates and domain services
   - No business logic here—that lives in domain

3) **Adapter Layer** — Boundary translation & external communication
   - Can import domain and application layers
   - Implements domain repository interfaces using GORM
   - Implements external service interfaces
   - Converts DTO ↔ domain objects
   - Handles HTTP request/response formatting

4) **Infrastructure Layer** — Technical implementations
   - Database connections, config loading, logging
   - Implements interfaces defined in domain/application
   - Can be swapped without changing domain logic

5) **Dependency Inversion**
   - Domain defines contracts (interfaces, aggregate roots)
   - Infrastructure implements those contracts
   - Application uses domain contracts; infrastructure wires implementations
   - **NEVER** let domain depend on infrastructure

## Full DDD Patterns Explained

### 1. Value Objects — Immutable Domain Concepts

Value Objects represent concepts from your ubiquitous language. Unlike entities, they have no identity and are immutable.

```go
// domain/value_objects.go
package domain

import (
    "errors"
    "fmt"
)

// PlayerID is an immutable value object representing a player's unique identity
type PlayerID struct {
    value string
}

func NewPlayerID(id string) (*PlayerID, error) {
    if id == "" {
        return nil, errors.New("player_id_empty")
    }
    return &PlayerID{value: id}, nil
}

func (p *PlayerID) String() string {
    return p.value
}

func (p *PlayerID) Equals(other *PlayerID) bool {
    return p.value == other.value
}

// Points is an immutable value object
type Points struct {
    amount int
}

func NewPoints(amount int) (*Points, error) {
    if amount < 0 {
        return nil, errors.New("points_negative")
    }
    return &Points{amount: amount}, nil
}

func (p *Points) Add(other *Points) (*Points, error) {
    return NewPoints(p.amount + other.amount)
}

func (p *Points) Subtract(other *Points) (*Points, error) {
    if other.amount > p.amount {
        return nil, errors.New("insufficient_points")
    }
    return NewPoints(p.amount - other.amount)
}

func (p *Points) IsGreaterThan(other *Points) bool {
    return p.amount > other.amount
}

func (p *Points) Value() int {
    return p.amount
}

// Nickname is a value object with domain rules
type Nickname struct {
    value string
}

func NewNickname(name string) (*Nickname, error) {
    if len(name) < 3 || len(name) > 50 {
        return nil, errors.New("nickname_invalid_length")
    }
    return &Nickname{value: name}, nil
}

func (n *Nickname) String() string {
    return n.value
}
```

**Benefits of Value Objects:**
- Type safety: can't confuse PlayerID with RewardID
- Encapsulate business rules: Points can't be negative
- Immutable: no accidental state changes
- Easy to test: `points1.Add(points2)` returns new Points
- Express domain language: `PlayerID`, `Points` are business concepts

### 2. Aggregate Roots — Entities with Invariants

Aggregates are clusters of domain objects bound together by a root entity. The aggregate root enforces business invariants and manages state changes.

```go
// domain/aggregate_root.go
package domain

import (
    "errors"
    "time"
)

// Player is the aggregate root for the player bounded context
// It enforces all business rules and invariants
type Player struct {
    // Aggregate identity
    id *PlayerID
    
    // Value objects
    nickname *Nickname
    points   *Points
    
    // Status (enum-like)
    status PlayerStatus // "active", "banned", "suspended"
    
    // Metadata
    createdAt time.Time
    updatedAt time.Time
    
    // Transient: not persisted, cleared after use
    domainEvents []DomainEvent
}

type PlayerStatus string

const (
    PlayerStatusActive    PlayerStatus = "active"
    PlayerStatusBanned    PlayerStatus = "banned"
    PlayerStatusSuspended PlayerStatus = "suspended"
)

// Constructor: Factory pattern ensures valid aggregate creation
func NewPlayer(id *PlayerID, nickname *Nickname) (*Player, error) {
    if id == nil || nickname == nil {
        return nil, errors.New("invalid_player_args")
    }
    
    player := &Player{
        id:           id,
        nickname:     nickname,
        points:       &Points{amount: 0},
        status:       PlayerStatusActive,
        createdAt:    time.Now(),
        updatedAt:    time.Now(),
        domainEvents: []DomainEvent{},
    }
    
    // Emit "player created" event
    player.raiseEvent(&PlayerCreatedEvent{
        PlayerID:  id,
        Nickname:  nickname,
        CreatedAt: player.createdAt,
    })
    
    return player, nil
}

// Accessors (read-only)
func (p *Player) ID() *PlayerID            { return p.id }
func (p *Player) Nickname() *Nickname      { return p.nickname }
func (p *Player) Points() *Points          { return p.points }
func (p *Player) Status() PlayerStatus     { return p.status }
func (p *Player) CreatedAt() time.Time     { return p.createdAt }

// Business behavior — all state changes go through methods
// These methods enforce invariants and emit events

// Enter records that a player has entered the game
func (p *Player) Enter() error {
    if p.status != PlayerStatusActive {
        return errors.New("player_not_active")
    }
    
    p.raiseEvent(&PlayerEnteredEvent{
        PlayerID:  p.id,
        Nickname:  p.nickname,
        EnteredAt: time.Now(),
    })
    
    return nil
}

// AddPoints adds points, enforcing invariants
func (p *Player) AddPoints(amount *Points) error {
    if p.status != PlayerStatusActive {
        return errors.New("player_not_active_for_points")
    }
    
    if amount == nil || amount.Value() == 0 {
        return errors.New("invalid_points_amount")
    }
    
    newPoints, err := p.points.Add(amount)
    if err != nil {
        return err
    }
    
    p.points = newPoints
    p.updatedAt = time.Now()
    
    p.raiseEvent(&PointsAddedEvent{
        PlayerID:  p.id,
        Amount:    amount.Value(),
        Total:     p.points.Value(),
        Timestamp: p.updatedAt,
    })
    
    return nil
}

// Suspend suspends the player (e.g., due to fraud detection)
func (p *Player) Suspend(reason string) error {
    if p.status == PlayerStatusSuspended {
        return errors.New("already_suspended")
    }
    
    p.status = PlayerStatusSuspended
    p.updatedAt = time.Now()
    
    p.raiseEvent(&PlayerSuspendedEvent{
        PlayerID: p.id,
        Reason:   reason,
        At:       p.updatedAt,
    })
    
    return nil
}

// Event management (transient, not persisted in DB)
func (p *Player) DomainEvents() []DomainEvent {
    events := p.domainEvents
    p.domainEvents = nil // clear after reading
    return events
}

func (p *Player) raiseEvent(e DomainEvent) {
    p.domainEvents = append(p.domainEvents, e)
}

// Invariant check — called by repository before persist
func (p *Player) IsValid() error {
    if p.id == nil {
        return errors.New("player_missing_id")
    }
    if p.nickname == nil {
        return errors.New("player_missing_nickname")
    }
    if p.points.Value() < 0 {
        return errors.New("player_negative_points_invariant_violated")
    }
    return nil
}
```

**Aggregate Root Characteristics:**
- Single entry point for all state changes
- Enforces business invariants (e.g., points ≥ 0, status is valid)
- Emits domain events for all meaningful changes
- Contains value objects (Nickname, Points) not raw strings/ints
- Constructor validates preconditions
- All domain logic encapsulated in behavior methods

### 3. Domain Events — Immutable Records of Domain Facts

Domain events capture important business occurrences. They enable event-driven architectures without coupling.

```go
// domain/events.go
package domain

import "time"

// DomainEvent is the marker interface for all domain events
type DomainEvent interface {
    EventType() string
    OccurredAt() time.Time
}

// PlayerCreatedEvent fired when a new player is created
type PlayerCreatedEvent struct {
    PlayerID  *PlayerID
    Nickname  *Nickname
    CreatedAt time.Time
}

func (e *PlayerCreatedEvent) EventType() string  { return "player.created" }
func (e *PlayerCreatedEvent) OccurredAt() time.Time { return e.CreatedAt }

// PlayerEnteredEvent fired when a player enters the game
type PlayerEnteredEvent struct {
    PlayerID  *PlayerID
    Nickname  *Nickname
    EnteredAt time.Time
}

func (e *PlayerEnteredEvent) EventType() string { return "player.entered" }
func (e *PlayerEnteredEvent) OccurredAt() time.Time { return e.EnteredAt }

// PointsAddedEvent fired when points are credited
type PointsAddedEvent struct {
    PlayerID  *PlayerID
    Amount    int
    Total     int
    Timestamp time.Time
}

func (e *PointsAddedEvent) EventType() string { return "points.added" }
func (e *PointsAddedEvent) OccurredAt() time.Time { return e.Timestamp }

// PlayerSuspendedEvent fired when player is suspended
type PlayerSuspendedEvent struct {
    PlayerID *PlayerID
    Reason   string
    At       time.Time
}

func (e *PlayerSuspendedEvent) EventType() string { return "player.suspended" }
func (e *PlayerSuspendedEvent) OccurredAt() time.Time { return e.At }
```

**Domain Events Benefits:**
- Immutable records of what happened in the business
- Enable analytics: "how many players entered today?"
- Enable notifications: "send email when player reaches 1000 points"
- Enable audit trail: "who did what and when"
- Decouple bounded contexts: Game context subscribes to player events
- Support event sourcing patterns in the future

### 4. Repository Interfaces (Domain Contracts)

Repositories defined in domain layer; implementations in infrastructure layer. This inversion of control keeps domain pure.

```go
// domain/repository.go
package domain

import "context"

// PlayerRepository defines the contract for player persistence
// Defined in domain; implemented in infrastructure (adapter)
type PlayerRepository interface {
    // Store persists a new player
    Store(ctx context.Context, player *Player) error
    
    // FindByID retrieves a player by ID
    FindByID(ctx context.Context, id *PlayerID) (*Player, error)
    
    // FindByNickname retrieves a player by nickname (must be unique in domain)
    FindByNickname(ctx context.Context, nickname *Nickname) (*Player, error)
    
    // Update persists changes to an existing player
    Update(ctx context.Context, player *Player) error
    
    // Delete removes a player
    Delete(ctx context.Context, id *PlayerID) error
}
```

**Repository Pattern Benefits:**
- Domain layer has no GORM/SQL knowledge
- Easy to swap implementations (in-memory for tests, PostgreSQL for prod)
- Dependency inversion: domain defines interface, infrastructure implements it
- Repository methods named after business operations (Store, FindByNickname)

### 5. Factory Pattern — Complex Aggregate Creation

Factories encapsulate complex creation logic and ensure aggregates are always in a valid state.

```go
// domain/factory.go
package domain

import "errors"

// PlayerFactory creates Player aggregates with validation
type PlayerFactory struct {
    // Could inject validators, ID generators, etc.
}

func NewPlayerFactory() *PlayerFactory {
    return &PlayerFactory{}
}

// CreateNewPlayer validates inputs and creates a valid Player aggregate
func (f *PlayerFactory) CreateNewPlayer(idStr, nicknameStr string) (*Player, error) {
    // Validate and create PlayerID
    id, err := NewPlayerID(idStr)
    if err != nil {
        return nil, err
    }
    
    // Validate and create Nickname
    nickname, err := NewNickname(nicknameStr)
    if err != nil {
        return nil, err
    }
    
    // Create aggregate with validation
    player, err := NewPlayer(id, nickname)
    if err != nil {
        return nil, err
    }
    
    // Validate invariants before returning
    if err := player.IsValid(); err != nil {
        return nil, err
    }
    
    return player, nil
}

// ReconstructPlayer rebuilds an existing Player from persistence
// (no PlayerCreatedEvent emitted—used for loading, not creation)
func (f *PlayerFactory) ReconstructPlayer(id, nickname, status string, points int) (*Player, error) {
    playerID, err := NewPlayerID(id)
    if err != nil {
        return nil, err
    }
    
    playerNickname, err := NewNickname(nickname)
    if err != nil {
        return nil, err
    }
    
    pointsObj, err := NewPoints(points)
    if err != nil {
        return nil, err
    }
    
    player := &Player{
        id:           playerID,
        nickname:     playerNickname,
        points:       pointsObj,
        status:       PlayerStatus(status),
        domainEvents: []DomainEvent{}, // no events on reconstruction
    }
    
    return player, nil
}
```

**Factory Pattern Benefits:**
- Encapsulates complex validation logic
- Ensures aggregates are always valid
- Separates creation concerns from aggregate responsibility
- CreateNewPlayer vs ReconstructPlayer distinguish new vs loaded aggregates

### 6. Specifications — Query Logic Without Coupling

Specifications encapsulate complex query logic (e.g., "players with score > X and active status").

```go
// domain/specification.go
package domain

// Specification is a design pattern for encapsulating complex query logic
// Implementations are in the adapter/repository layer
type Specification interface {
    // IsSatisfiedBy checks if an aggregate satisfies the specification
    IsSatisfiedBy(player *Player) bool
    
    // ToSQL returns the SQL WHERE clause (optional, for repository optimization)
    ToSQL() string
}

// ActivePlayersWithHighScoreSpec — players who are active and have > 5000 points
type ActivePlayersWithHighScoreSpec struct {
    minPoints int
}

func NewActivePlayersWithHighScoreSpec(minPoints int) *ActivePlayersWithHighScoreSpec {
    return &ActivePlayersWithHighScoreSpec{minPoints: minPoints}
}

func (s *ActivePlayersWithHighScoreSpec) IsSatisfiedBy(p *Player) bool {
    return p.Status() == PlayerStatusActive && p.Points().Value() > s.minPoints
}

func (s *ActivePlayersWithHighScoreSpec) ToSQL() string {
    return "status = 'active' AND points > $1"
}

// SuspendedPlayersSpec — players who are currently suspended
type SuspendedPlayersSpec struct{}

func (s *SuspendedPlayersSpec) IsSatisfiedBy(p *Player) bool {
    return p.Status() == PlayerStatusSuspended
}

func (s *SuspendedPlayersSpec) ToSQL() string {
    return "status = 'suspended'"
}
```

**Usage in Repository:**
```go
// In repository (adapter layer)
func (r *PlayerRepositoryGorm) FindMatching(ctx context.Context, spec Specification) ([]*Player, error) {
    var players []*Player
    if err := r.db.WithContext(ctx).Where(spec.ToSQL()).Scan(&players).Error; err != nil {
        return nil, err
    }
    return players, nil
}

// In usecase
activeHighScores := NewActivePlayersWithHighScoreSpec(5000)
players, _ := repo.FindMatching(ctx, activeHighScores)
```

**Specification Benefits:**
- Query logic separate from repository
- Reusable across multiple use cases
- Can be tested independently
- Domain language: "ActivePlayersWithHighScoreSpec" expresses intent

### 7. Domain Services — Operations Beyond Single Aggregates

When business logic doesn't fit into a single aggregate, use a domain service. Domain services coordinate multiple aggregates and are stateless.

```go
// domain/player_service.go
package domain

import "context"

// PlayerDomainService handles player-related operations that span multiple aggregates
type PlayerDomainService struct {
    playerRepo PlayerRepository
    rewardRepo RewardRepository // from reward bounded context
}

func NewPlayerDomainService(playerRepo PlayerRepository, rewardRepo RewardRepository) *PlayerDomainService {
    return &PlayerDomainService{
        playerRepo: playerRepo,
        rewardRepo: rewardRepo,
    }
}

// GrantRewardToHighScorers awards rewards to all players with > 10,000 points
func (s *PlayerDomainService) GrantRewardToHighScorers(ctx context.Context) error {
    spec := NewActivePlayersWithHighScoreSpec(10000)
    players, err := s.playerRepo.FindMatching(ctx, spec)
    if err != nil {
        return err
    }
    
    for _, player := range players {
        // Business rule: each high scorer gets a special reward
        reward, err := s.rewardRepo.CreateSpecialReward(ctx, player.ID())
        if err != nil {
            return err
        }
        
        // Domain event: reward granted
        player.raiseEvent(&RewardGrantedEvent{
            PlayerID:  player.ID(),
            RewardID:  reward.ID(),
            GrantedAt: time.Now(),
        })
        
        // Persist changes
        if err := s.playerRepo.Update(ctx, player); err != nil {
            return err
        }
    }
    
    return nil
}
```

**Domain Service Characteristics:**
- Stateless (no fields that represent state)
- Coordinates multiple aggregates
- Operates within a single bounded context
- Named after domain language ("PlayerDomainService", not "Helper")

### 8. Application Services (Usecases) — Transactional Boundaries

Application services orchestrate domain objects and manage transactions. They are thin; business logic lives in the domain.

```go
// application/enter/enter.go
package enter

import (
    "context"
    "errors"
    
    "backend/internal/modules/player/domain"
    shared "backend/internal/shared/domain"
)

// UseCase represents the "Player Enter Game" use case
type UseCase struct {
    playerRepo domain.PlayerRepository
    factory    *domain.PlayerFactory
    eventBus   EventPublisher // interface for publishing events
}

// EventPublisher defines how events are published to other contexts
type EventPublisher interface {
    Publish(ctx context.Context, events ...shared.DomainEvent) error
}

func New(repo domain.PlayerRepository, factory *domain.PlayerFactory, eventBus EventPublisher) *UseCase {
    return &UseCase{
        playerRepo: repo,
        factory:    factory,
        eventBus:   eventBus,
    }
}

// Request is the input DTO (not a domain object)
type Request struct {
    Nickname string `json:"nickname" validate:"required,min=3,max=50"`
}

// Response is the output DTO
type Response struct {
    ID          string    `json:"id"`
    Nickname    string    `json:"nickname"`
    TotalPoints int       `json:"total_points"`
    IsNew       bool      `json:"is_new"`
    CreatedAt   time.Time `json:"created_at"`
}

func (r *Response) StatusCode() int {
    if r.IsNew {
        return http.StatusCreated      // 201 - New player
    }
    return http.StatusOK               // 200 - Existing player
}

// Execute is the main business operation
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
    // 1. Parse/validate input (already done in handler)
    if req.Nickname == "" {
        return nil, errors.New("nickname_required")
    }
    
    // 2. Try to find existing player
    existingPlayer, err := uc.playerRepo.FindByNickname(ctx, &domain.Nickname{value: req.Nickname})
    if err != nil && !errors.Is(err, domain.ErrNotFound) {
        return nil, err
    }
    
    // 3a. Player exists: call domain behavior
    if existingPlayer != nil {
        if err := existingPlayer.Enter(); err != nil {
            return nil, err
        }
        
        if err := uc.playerRepo.Update(ctx, existingPlayer); err != nil {
            return nil, err
        }
        
        // Publish domain events to event bus
        events := existingPlayer.DomainEvents()
        if err := uc.eventBus.Publish(ctx, events...); err != nil {
            return nil, err
        }
        
        return &Response{
            ID:          existingPlayer.ID().String(),
            Nickname:    existingPlayer.Nickname().String(),
            TotalPoints: existingPlayer.Points().Value(),
            IsNew:       false,
            CreatedAt:   existingPlayer.CreatedAt(),
        }, nil
    }
    
    // 3b. New player: create and persist
    newPlayer, err := uc.factory.CreateNewPlayer(uuid.New().String(), req.Nickname)
    if err != nil {
        return nil, err
    }
    
    if err := uc.playerRepo.Store(ctx, newPlayer); err != nil {
        return nil, err
    }
    
    // Publish domain events
    events := newPlayer.DomainEvents()
    if err := uc.eventBus.Publish(ctx, events...); err != nil {
        return nil, err
    }
    
    return &Response{
        ID:          newPlayer.ID().String(),
        Nickname:    newPlayer.Nickname().String(),
        TotalPoints: newPlayer.Points().Value(),
        IsNew:       true,
        CreatedAt:   newPlayer.CreatedAt(),
    }, nil
}
```

**Application Service Characteristics:**
- Thin orchestration layer
- Loads aggregates via repository
- Calls aggregate methods (domain logic)
- Publishes domain events
- Manages transaction boundaries
- Converts domain objects to DTOs

### 9. Adapter Layer — Repository Implementation

The adapter layer implements domain interfaces using GORM. It translates between domain objects and database rows.

```go
// adapter/repository/player_repository_gorm.go
package repository

import (
    "context"
    "errors"
    
    "gorm.io/gorm"
    "backend/internal/modules/player/domain"
)

// PlayerModel is the GORM model (not a domain object)
type PlayerModel struct {
    ID        string `gorm:"primaryKey"`
    Nickname  string `gorm:"uniqueIndex"`
    Points    int
    Status    string
    CreatedAt time.Time
    UpdatedAt time.Time
}

func (PlayerModel) TableName() string {
    return "players"
}

// PlayerRepositoryGorm implements domain.PlayerRepository
type PlayerRepositoryGorm struct {
    db *gorm.DB
    factory *domain.PlayerFactory
}

func NewPlayerRepositoryGorm(db *gorm.DB, factory *domain.PlayerFactory) *PlayerRepositoryGorm {
    return &PlayerRepositoryGorm{db: db, factory: factory}
}

// Store persists a new player aggregate
func (r *PlayerRepositoryGorm) Store(ctx context.Context, player *domain.Player) error {
    if err := player.IsValid(); err != nil {
        return err
    }
    
    model := &PlayerModel{
        ID:       player.ID().String(),
        Nickname: player.Nickname().String(),
        Points:   player.Points().Value(),
        Status:   string(player.Status()),
    }
    
    return r.db.WithContext(ctx).Create(model).Error
}

// FindByID loads a player by ID
func (r *PlayerRepositoryGorm) FindByID(ctx context.Context, id *domain.PlayerID) (*domain.Player, error) {
    model := &PlayerModel{}
    
    if err := r.db.WithContext(ctx).Where("id = ?", id.String()).First(model).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, domain.ErrPlayerNotFound
        }
        return nil, err
    }
    
    return r.factory.ReconstructPlayer(model.ID, model.Nickname, model.Status, model.Points)
}

// FindByNickname loads a player by nickname
func (r *PlayerRepositoryGorm) FindByNickname(ctx context.Context, nickname *domain.Nickname) (*domain.Player, error) {
    model := &PlayerModel{}
    
    if err := r.db.WithContext(ctx).Where("nickname = ?", nickname.String()).First(model).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, domain.ErrPlayerNotFound
        }
        return nil, err
    }
    
    return r.factory.ReconstructPlayer(model.ID, model.Nickname, model.Status, model.Points)
}

// Update persists changes to an existing player
func (r *PlayerRepositoryGorm) Update(ctx context.Context, player *domain.Player) error {
    if err := player.IsValid(); err != nil {
        return err
    }
    
    model := &PlayerModel{
        ID:       player.ID().String(),
        Nickname: player.Nickname().String(),
        Points:   player.Points().Value(),
        Status:   string(player.Status()),
    }
    
    return r.db.WithContext(ctx).Save(model).Error
}

// Delete removes a player
func (r *PlayerRepositoryGorm) Delete(ctx context.Context, id *domain.PlayerID) error {
    return r.db.WithContext(ctx).Where("id = ?", id.String()).Delete(&PlayerModel{}).Error
}

// FindMatching loads players matching a specification
func (r *PlayerRepositoryGorm) FindMatching(ctx context.Context, spec domain.Specification) ([]*domain.Player, error) {
    var models []*PlayerModel
    
    if err := r.db.WithContext(ctx).Where(spec.ToSQL()).Find(&models).Error; err != nil {
        return nil, err
    }
    
    players := make([]*domain.Player, 0, len(models))
    for _, model := range models {
        p, err := r.factory.ReconstructPlayer(model.ID, model.Nickname, model.Status, model.Points)
        if err != nil {
            return nil, err
        }
        players = append(players, p)
    }
    
    return players, nil
}
```

**Repository Implementation Characteristics:**
- Implements domain.PlayerRepository interface
- Translates between domain aggregates and GORM models
- Never exposes GORM models outside this file
- Domain layer has zero knowledge of GORM
- Easy to swap with in-memory implementation for tests

### 10. Anti-Corruption Layer — Isolating Domain from External Systems

When integrating with third-party services, create an anti-corruption layer to prevent external models from polluting the domain.

```go
// adapter/external/payment_gateway.go
package external

import (
    "context"
    "errors"
    
    "backend/internal/modules/reward/domain"
    paymentapi "external-payment-provider/api"  // third-party import
)

// PaymentGatewayClient wraps the external payment service
// This is the anti-corruption layer
type PaymentGatewayClient struct {
    client paymentapi.Client
}

// PaymentResult is our domain view of a payment (decoupled from external API)
type PaymentResult struct {
    TransactionID string
    Amount        int
    Status        string
}

// ProcessPayment translates from domain to external API and back
func (p *PaymentGatewayClient) ProcessPayment(ctx context.Context, reward *domain.Reward) (*PaymentResult, error) {
    // 1. Translate domain reward to external API request
    externalReq := &paymentapi.PaymentRequest{
        ExternalID:  reward.ID().String(),
        Amount:      reward.Value().InCents(),
        Currency:    "USD",
        Description: "Reward payout for " + reward.Winner().String(),
    }
    
    // 2. Call external API
    externalResp, err := p.client.CreatePayment(ctx, externalReq)
    if err != nil {
        return nil, err
    }
    
    // 3. Translate external response back to our domain
    // This ensures external API changes don't affect domain
    return &PaymentResult{
        TransactionID: externalResp.TransactionID,
        Amount:        externalResp.Amount,
        Status:        mapExternalStatusToDomain(externalResp.Status),
    }, nil
}

// mapExternalStatusToDomain converts external payment status to our domain language
func mapExternalStatusToDomain(externalStatus string) string {
    // Map external API's status to our business language
    switch externalStatus {
    case "COMPLETED":
        return "paid"
    case "PENDING":
        return "processing"
    case "FAILED":
        return "failed"
    default:
        return "unknown"
    }
}

// Errors from external API are translated to domain errors
func wrapExternalError(err error) error {
    if strings.Contains(err.Error(), "insufficient_funds") {
        return domain.ErrInsufficientFunds
    }
    return domain.ErrPaymentFailed
}
```

**Anti-Corruption Layer Benefits:**
- External API changes don't ripple into domain logic
- Domain remains pure; no third-party dependencies
- Clear translation boundary between external and domain models
- Errors converted to domain errors
- Easy to mock for testing

### 11. Event Publishing to Other Bounded Contexts

Domain events are the mechanism for communication between bounded contexts.

```go
// infrastructure/event_bus/domain_event_publisher.go
package event_bus

import (
    "context"
    "encoding/json"
    
    "backend/internal/shared/domain"
    amqp "github.com/rabbitmq/amqp091-go"
)

// DomainEventPublisher publishes domain events to other contexts
type DomainEventPublisher struct {
    channel *amqp.Channel
}

func New(channel *amqp.Channel) *DomainEventPublisher {
    return &DomainEventPublisher{channel: channel}
}

// Publish sends domain events to RabbitMQ exchange
func (p *DomainEventPublisher) Publish(ctx context.Context, events ...domain.DomainEvent) error {
    for _, event := range events {
        // Serialize domain event to JSON
        payload, err := json.Marshal(event)
        if err != nil {
            return err
        }
        
        // Route by event type (domain.EventType() returns "player.entered", etc.)
        routingKey := event.EventType()
        
        msg := amqp.Publishing{
            ContentType: "application/json",
            Body:        payload,
        }
        
        if err := p.channel.PublishWithContext(
            ctx,
            "domain-events",  // exchange
            routingKey,       // routing key
            false, false,     // mandatory, immediate
            msg,
        ); err != nil {
            return err
        }
    }
    
    return nil
}
```

**Usage in Application Service:**
```go
// In usecase
events := player.DomainEvents()
if err := uc.eventBus.Publish(ctx, events...); err != nil {
    return nil, err
}

// Other bounded contexts (game, reward, history) subscribe to these events
// No coupling: they don't know about player domain, just listen to events
```

**Event Publishing Benefits:**
- Bounded contexts communicate via events, not function calls
- Async: no waiting for other contexts to process
- Loose coupling: each context independent
- Audit trail: all business events are recorded
- Event sourcing ready: events as source of truth

## Guidelines for Implementation

### 1. Design Phases (Per Bounded Context)

**Phase 1: Domain Model**
- Define aggregate roots with behavior
- Create value objects for domain concepts
- Define domain interfaces (Repository)
- Create domain events
- Write domain layer unit tests (zero infrastructure needed)

**Phase 2: Application Layer**
- Create use cases that orchestrate domain
- Define Request/Response DTOs
- Wire repositories to domain objects
- Publish events

**Phase 3: Adapter Layer**
- Implement repository using GORM
- Create HTTP handlers
- Wire dependency injection

**Phase 4: Infrastructure**
- Database migrations
- Event bus configuration
- External service clients

### 2. Rules for New Operations

1. **If it's business logic** → lives in aggregate method (domain)
2. **If it's multi-aggregate coordination** → domain service
3. **If it's a use case** → application service (thin orchestrator)
4. **If it's DTO translation** → adapter layer
5. **If it's repository** → interface in domain, impl in adapter

### 3. Testing Strategy

```go
// Unit test: domain logic (no DB, no HTTP)
func TestPlayerAddPoints(t *testing.T) {
    player, _ := domain.NewPlayer(id, nickname)
    points, _ := domain.NewPoints(100)
    
    err := player.AddPoints(points)
    
    assert.NoError(t, err)
    assert.Equal(t, 100, player.Points().Value())
    
    events := player.DomainEvents()
    assert.Len(t, events, 1)
    assert.Equal(t, "points.added", events[0].EventType())
}

// Integration test: usecase + repository
func TestPlayerEnterUseCase(t *testing.T) {
    repo := NewInMemoryPlayerRepo()  // or real DB in transaction
    uc := enter.New(repo, factory, mockEventBus)
    
    resp, err := uc.Execute(ctx, &enter.Request{Nickname: "alice"})
    
    assert.NoError(t, err)
    assert.True(t, resp.IsNew)
}

// E2E test: HTTP handler + full stack
func TestEnterPlayerHTTP(t *testing.T) {
    server := setupTestServer()
    
    body := `{"nickname": "bob"}`
    resp := server.Post("/players/enter", body)
    
    assert.Equal(t, 201, resp.StatusCode)
}
```

### 4. Dependency Injection Pattern

```go
// module.go — DI container for bounded context
package player

import (
    "backend/internal/modules/player/adapter/handler"
    "backend/internal/modules/player/adapter/repository"
    "backend/internal/modules/player/application/enter"
    "backend/internal/modules/player/domain"
)

type Module struct {
    PlayerRepo *repository.PlayerRepositoryGorm
    EnterUC    *enter.UseCase
    Handler    *handler.PlayerHandler
}

func NewModule(db *gorm.DB, eventBus enter.EventPublisher) *Module {
    factory := domain.NewPlayerFactory()
    playerRepo := repository.NewPlayerRepositoryGorm(db, factory)
    enterUC := enter.New(playerRepo, factory, eventBus)
    playerHandler := handler.NewPlayerHandler(enterUC)
    
    return &Module{
        PlayerRepo: playerRepo,
        EnterUC:    enterUC,
        Handler:    playerHandler,
    }
}
```

## Summary of Full DDD Architecture

| Layer | Responsibility | Go Convention |
|-------|----------------|---------------|
| **Domain** | Business logic, invariants, events | Aggregates, Value Objects, Services |
| **Application** | Orchestration, transactions | Use Cases (thin) |
| **Adapter** | Boundary translation | Handlers, Repository impl, DTOs |
| **Infrastructure** | Technical concerns | DB, Config, External APIs |

**Key Principles:**
- ✅ Domain is independent (no framework imports)
- ✅ Use cases are thin (logic lives in aggregates)
- ✅ Repository interfaces in domain, implementations in adapter
- ✅ Events enable loose coupling between contexts
- ✅ Value Objects enforce type safety and ubiquitous language
- ✅ Anti-corruption layer isolates external systems
- ✅ No interfaces unless 2+ implementations exist (Go way)

This architecture scales from small projects to large microservices, enabling team collaboration and domain knowledge preservation.