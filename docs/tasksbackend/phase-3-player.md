# Phase 3: Player Module

**Difficulty:** ⭐⭐⭐  
**Tasks:** 12  
**Dependencies:** Phase 1, Phase 2

---

## Objective

Implement Player bounded context with full DDD patterns. This is the foundational module.

**Endpoints:**
- `POST /players/enter` - Enter/Resume player
- `GET /players/:id` - Get player profile (partial, completed in Phase 6)

---

## Tasks

### 3A. Domain Layer

#### Task 3.1: Create Player Aggregate Root

**File:** `backend/internal/modules/player/domain/aggregate_root.go`

```go
package domain

import (
    "time"
    shared "backend/internal/shared/domain"
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

// Constructor for new player
func NewPlayer(id *PlayerID, nickname *Nickname) (*Player, error)

// Reconstruction from persistence
func ReconstructPlayer(id *PlayerID, nickname *Nickname, points *shared.Points, createdAt, updatedAt time.Time) *Player

// Accessors (read-only)
func (p *Player) ID() *PlayerID
func (p *Player) Nickname() *Nickname
func (p *Player) TotalPoints() *shared.Points
func (p *Player) CreatedAt() time.Time
func (p *Player) UpdatedAt() time.Time

// Business behavior
func (p *Player) AddPoints(amount *shared.Points) error
func (p *Player) Enter() // Records entry, emits event

// Event management
func (p *Player) DomainEvents() []shared.DomainEvent
func (p *Player) ClearEvents()

// Validation
func (p *Player) IsValid() error
```

**Status:** ⬜ Not Started

---

#### Task 3.2: Create Player Value Objects

**File:** `backend/internal/modules/player/domain/value_objects.go`

```go
package domain

import (
    "errors"
    "github.com/google/uuid"
)

// PlayerID is a value object for player identity
type PlayerID struct {
    value string
}

func NewPlayerID(id string) (*PlayerID, error)
func GeneratePlayerID() *PlayerID  // Uses uuid.New()
func (p *PlayerID) String() string
func (p *PlayerID) Equals(other *PlayerID) bool
func (p *PlayerID) IsZero() bool

// Nickname is a value object with validation rules
type Nickname struct {
    value string
}

// Validation rules from config (min/max length)
func NewNickname(name string, minLen, maxLen int) (*Nickname, error)
func (n *Nickname) String() string
func (n *Nickname) Equals(other *Nickname) bool
```

**Requirements:**
- PlayerID validates UUID format
- Nickname validates length (configurable min/max)
- Both are immutable

**Status:** ⬜ Not Started

---

#### Task 3.3: Create PlayerRepository Interface

**File:** `backend/internal/modules/player/domain/repository.go`

```go
package domain

import "context"

// PlayerRepository defines persistence contract
// Defined in domain, implemented in adapter
type PlayerRepository interface {
    // Create stores a new player
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
```

**Status:** ⬜ Not Started

---

#### Task 3.4: Create PlayerFactory

**File:** `backend/internal/modules/player/domain/factory.go`

```go
package domain

import shared "backend/internal/shared/domain"

// PlayerFactory creates Player aggregates
type PlayerFactory struct {
    nicknameMinLen int
    nicknameMaxLen int
}

func NewPlayerFactory(minLen, maxLen int) *PlayerFactory

// CreateNewPlayer creates a brand new player
func (f *PlayerFactory) CreateNewPlayer(nickname string) (*Player, error)

// ReconstructPlayer rebuilds from persistence (no events emitted)
func (f *PlayerFactory) ReconstructPlayer(
    id string,
    nickname string,
    totalPoints int,
    createdAt, updatedAt time.Time,
) (*Player, error)
```

**Status:** ⬜ Not Started

---

#### Task 3.5: Create Player Domain Events

**File:** `backend/internal/modules/player/domain/events.go`

```go
package domain

import (
    "time"
    shared "backend/internal/shared/domain"
)

// PlayerCreatedEvent fired when new player is created
type PlayerCreatedEvent struct {
    shared.BaseEvent
    Nickname  string
    CreatedAt time.Time
}

func NewPlayerCreatedEvent(playerID, nickname string) *PlayerCreatedEvent
func (e *PlayerCreatedEvent) EventType() string { return "player.created" }

// PlayerEnteredEvent fired when player enters game
type PlayerEnteredEvent struct {
    shared.BaseEvent
    EnteredAt time.Time
}

func NewPlayerEnteredEvent(playerID string) *PlayerEnteredEvent
func (e *PlayerEnteredEvent) EventType() string { return "player.entered" }

// PointsAddedEvent fired when points are added
type PointsAddedEvent struct {
    shared.BaseEvent
    Amount      int
    TotalAfter  int
    AddedAt     time.Time
}

func NewPointsAddedEvent(playerID string, amount, totalAfter int) *PointsAddedEvent
func (e *PointsAddedEvent) EventType() string { return "player.points_added" }
```

**Status:** ⬜ Not Started

---

### 3B. Application Layer

#### Task 3.6: Create EnterUseCase

**File:** `backend/internal/modules/player/application/enter/usecase.go`

```go
package enter

import (
    "context"
    "backend/internal/modules/player/domain"
)

// UseCase handles player enter/resume
type UseCase struct {
    playerRepo    domain.PlayerRepository
    playerFactory *domain.PlayerFactory
}

func New(repo domain.PlayerRepository, factory *domain.PlayerFactory) *UseCase

// Execute enters existing player or creates new one
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error)
```

**Logic:**
1. Validate request
2. Try FindByNickname
3. If found → return existing player (200)
4. If not found → create new player (201)
5. Return response with appropriate status

**Status:** ⬜ Not Started

---

#### Task 3.7: Create GetProfileUseCase

**File:** `backend/internal/modules/player/application/get_profile/usecase.go`

```go
package get_profile

import (
    "context"
    "backend/internal/modules/player/domain"
)

// UseCase handles get player profile
type UseCase struct {
    playerRepo domain.PlayerRepository
    // rewardRepo will be added in Phase 6
}

func New(repo domain.PlayerRepository) *UseCase

// Execute retrieves player profile
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error)
```

**Note:** This will be extended in Phase 6 to include claimed checkpoints.

**Status:** ⬜ Not Started

---

#### Task 3.8: Create Player DTOs

**File:** `backend/internal/modules/player/application/dto.go`

```go
package application

import "time"

// EnterRequest is input for enter usecase
type EnterRequest struct {
    Nickname string `json:"nickname" validate:"required,min=3,max=50"`
}

// PlayerResponse is output DTO
type PlayerResponse struct {
    ID          string    `json:"id"`
    Nickname    string    `json:"nickname"`
    TotalPoints int       `json:"total_points"`
    CreatedAt   time.Time `json:"created_at"`
    IsNew       bool      `json:"is_new,omitempty"`  // Only for enter
}

// ProfileResponse includes claimed checkpoints (added in Phase 6)
type ProfileResponse struct {
    ID                 string    `json:"id"`
    Nickname           string    `json:"nickname"`
    TotalPoints        int       `json:"total_points"`
    CreatedAt          time.Time `json:"created_at"`
    ClaimedCheckpoints []int     `json:"claimed_checkpoints"` // Phase 6
}
```

**Status:** ⬜ Not Started

---

### 3C. Adapter Layer

#### Task 3.9: Create PlayerModel (GORM)

**File:** `backend/internal/modules/player/adapter/repository/player_model.go`

```go
package repository

import (
    "time"
    "backend/internal/shared/constants"
)

// PlayerModel is the GORM database model
type PlayerModel struct {
    ID          string    `gorm:"type:uuid;primaryKey"`
    Nickname    string    `gorm:"type:varchar(50);uniqueIndex;not null"`
    TotalPoints int       `gorm:"type:integer;not null;default:0"`
    CreatedAt   time.Time `gorm:"not null"`
    UpdatedAt   time.Time `gorm:"not null"`
}

func (PlayerModel) TableName() string {
    return constants.TablePlayers
}
```

**Status:** ⬜ Not Started

---

#### Task 3.10: Implement PlayerRepositoryGorm

**File:** `backend/internal/modules/player/adapter/repository/player_repository_gorm.go`

```go
package repository

import (
    "context"
    "errors"
    "gorm.io/gorm"
    "backend/internal/modules/player/domain"
    shared "backend/internal/shared/domain"
)

// PlayerRepositoryGorm implements domain.PlayerRepository
type PlayerRepositoryGorm struct {
    db      *gorm.DB
    factory *domain.PlayerFactory
}

func NewPlayerRepositoryGorm(db *gorm.DB, factory *domain.PlayerFactory) *PlayerRepositoryGorm

// Implement all interface methods
func (r *PlayerRepositoryGorm) Store(ctx context.Context, player *domain.Player) error
func (r *PlayerRepositoryGorm) FindByID(ctx context.Context, id *domain.PlayerID) (*domain.Player, error)
func (r *PlayerRepositoryGorm) FindByNickname(ctx context.Context, nickname *domain.Nickname) (*domain.Player, error)
func (r *PlayerRepositoryGorm) Update(ctx context.Context, player *domain.Player) error
func (r *PlayerRepositoryGorm) ExistsByNickname(ctx context.Context, nickname *domain.Nickname) (bool, error)

// Helper: convert domain to model
func (r *PlayerRepositoryGorm) toModel(player *domain.Player) *PlayerModel

// Helper: convert model to domain
func (r *PlayerRepositoryGorm) toDomain(model *PlayerModel) (*domain.Player, error)
```

**Status:** ⬜ Not Started

---

#### Task 3.11: Create PlayerHandler

**File:** `backend/internal/modules/player/adapter/handler/player_handler.go`

```go
package handler

import (
    "github.com/gofiber/fiber/v2"
    "backend/internal/modules/player/application/enter"
    "backend/internal/modules/player/application/get_profile"
    httputil "backend/internal/shared/http"
    "backend/internal/shared/constants"
)

type PlayerHandler struct {
    enterUC      *enter.UseCase
    getProfileUC *get_profile.UseCase
}

func NewPlayerHandler(enterUC *enter.UseCase, getProfileUC *get_profile.UseCase) *PlayerHandler

// Enter handles POST /players/enter
func (h *PlayerHandler) Enter(c *fiber.Ctx) error {
    // 1. Parse request body
    // 2. Validate request
    // 3. Execute usecase
    // 4. Return response with appropriate status (200 or 201)
}

// GetProfile handles GET /players/:id
func (h *PlayerHandler) GetProfile(c *fiber.Ctx) error {
    // 1. Parse player ID from URL
    // 2. Execute usecase
    // 3. Return response
}
```

**Status:** ⬜ Not Started

---

#### Task 3.12: Register Player Routes

**File:** `backend/internal/modules/player/adapter/handler/routes.go`

```go
package handler

import "github.com/gofiber/fiber/v2"

// RegisterRoutes registers player routes
func (h *PlayerHandler) RegisterRoutes(app *fiber.App) {
    players := app.Group("/players")
    
    players.Post("/enter", h.Enter)
    players.Get("/:id", h.GetProfile)
}
```

**File:** `backend/internal/modules/player/module.go`

```go
package player

import (
    "gorm.io/gorm"
    "github.com/gofiber/fiber/v2"
    "backend/internal/infrastructure/config"
    "backend/internal/modules/player/domain"
    "backend/internal/modules/player/adapter/repository"
    "backend/internal/modules/player/adapter/handler"
    "backend/internal/modules/player/application/enter"
    "backend/internal/modules/player/application/get_profile"
)

// Module wires all player dependencies
type Module struct {
    Handler *handler.PlayerHandler
}

func NewModule(db *gorm.DB, cfg *config.Config) *Module {
    // Create factory with config
    factory := domain.NewPlayerFactory(
        cfg.Validation.Nickname.MinLength,
        cfg.Validation.Nickname.MaxLength,
    )
    
    // Create repository
    repo := repository.NewPlayerRepositoryGorm(db, factory)
    
    // Create usecases
    enterUC := enter.New(repo, factory)
    getProfileUC := get_profile.New(repo)
    
    // Create handler
    h := handler.NewPlayerHandler(enterUC, getProfileUC)
    
    return &Module{Handler: h}
}

func (m *Module) RegisterRoutes(app *fiber.App) {
    m.Handler.RegisterRoutes(app)
}
```

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] Player aggregate enforces invariants (points >= 0)
- [ ] Value objects are immutable with validation
- [ ] Repository interface defined in domain
- [ ] Repository implementation uses GORM
- [ ] Factory creates valid aggregates
- [ ] Domain events emitted on state changes
- [ ] `POST /players/enter` returns 201 for new, 200 for existing
- [ ] `GET /players/:id` returns player profile
- [ ] No hardcoded values (use config)
- [ ] All errors use constants

---

## File Structure After Phase 3

```
backend/internal/modules/player/
├── domain/
│   ├── aggregate_root.go
│   ├── value_objects.go
│   ├── repository.go
│   ├── factory.go
│   └── events.go
├── application/
│   ├── dto.go
│   ├── enter/
│   │   └── usecase.go
│   └── get_profile/
│       └── usecase.go
├── adapter/
│   ├── repository/
│   │   ├── player_model.go
│   │   └── player_repository_gorm.go
│   └── handler/
│       ├── player_handler.go
│       └── routes.go
└── module.go
```
