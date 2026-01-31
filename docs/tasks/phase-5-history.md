# Phase 5: History Module

**Difficulty:** ⭐⭐⭐  
**Tasks:** 10  
**Dependencies:** Phase 1, Phase 3

---

## Objective

Implement History bounded context for spin logs. This is read-heavy with pagination support.

**Endpoints:**
- `GET /history/global` - Global spin history (all players)
- `GET /history/:player_id` - Personal spin history (single player)

---

## Tasks

### 5A. Domain Layer

#### Task 5.1: Create SpinLog Entity

**File:** `backend/internal/modules/history/domain/spin_log.go`

```go
package domain

import (
    "time"
    "backend/internal/shared/constants"
)

// SpinLog represents a spin event record
type SpinLog struct {
    id           *SpinLogID
    playerID     string
    pointsGained int
    source       constants.SpinSource
    createdAt    time.Time
}

// Constructor for new spin log
func NewSpinLog(
    playerID string,
    pointsGained int,
    source constants.SpinSource,
) (*SpinLog, error)

// Reconstruction from persistence
func ReconstructSpinLog(
    id string,
    playerID string,
    pointsGained int,
    source string,
    createdAt time.Time,
) (*SpinLog, error)

// Accessors
func (s *SpinLog) ID() *SpinLogID
func (s *SpinLog) PlayerID() string
func (s *SpinLog) PointsGained() int
func (s *SpinLog) Source() constants.SpinSource
func (s *SpinLog) CreatedAt() time.Time

// Validation
func (s *SpinLog) IsValid() error
```

**Status:** ⬜ Not Started

---

#### Task 5.2: Create SpinLogID Value Object

**File:** `backend/internal/modules/history/domain/value_objects.go`

```go
package domain

import (
    "errors"
    "github.com/google/uuid"
)

// SpinLogID is a value object for spin log identity
type SpinLogID struct {
    value string
}

func NewSpinLogID(id string) (*SpinLogID, error)
func GenerateSpinLogID() *SpinLogID
func (s *SpinLogID) String() string
func (s *SpinLogID) IsZero() bool
```

**Status:** ⬜ Not Started

---

#### Task 5.3: Create SpinLogRepository Interface

**File:** `backend/internal/modules/history/domain/repository.go`

```go
package domain

import (
    "context"
    shared "backend/internal/shared/domain"
)

// SpinLogRepository defines persistence contract
type SpinLogRepository interface {
    // Store persists a new spin log
    Store(ctx context.Context, spinLog *SpinLog) error
    
    // FindByID loads spin log by ID
    FindByID(ctx context.Context, id *SpinLogID) (*SpinLog, error)
    
    // ListAll returns paginated global history with player info
    ListAll(ctx context.Context, params shared.PaginationParams) (*SpinLogListResult, error)
    
    // ListByPlayer returns paginated history for specific player
    ListByPlayer(ctx context.Context, playerID string, params shared.PaginationParams) (*SpinLogListResult, error)
    
    // CountTodayByPlayer counts today's spins for a player (for daily limit)
    CountTodayByPlayer(ctx context.Context, playerID string) (int, error)
}

// SpinLogListResult contains paginated results with metadata
type SpinLogListResult struct {
    Data   []*SpinLogWithPlayer
    Total  int64
    Limit  int
    Offset int
}

// SpinLogWithPlayer includes player nickname for display
type SpinLogWithPlayer struct {
    SpinLog        *SpinLog
    PlayerNickname string
}
```

**Status:** ⬜ Not Started

---

### 5B. Application Layer

#### Task 5.4: Create GetGlobalHistoryUseCase

**File:** `backend/internal/modules/history/application/get_global/usecase.go`

```go
package get_global

import (
    "context"
    "backend/internal/modules/history/domain"
    shared "backend/internal/shared/domain"
    "backend/internal/infrastructure/config"
)

// UseCase handles global history retrieval
type UseCase struct {
    spinLogRepo domain.SpinLogRepository
    paginationCfg *config.PaginationConfig
}

func New(repo domain.SpinLogRepository, cfg *config.PaginationConfig) *UseCase

// Execute retrieves paginated global spin history
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
    // 1. Build pagination params with config defaults
    // 2. Call repository
    // 3. Map to response DTO
}
```

**Status:** ⬜ Not Started

---

#### Task 5.5: Create GetPersonalHistoryUseCase

**File:** `backend/internal/modules/history/application/get_personal/usecase.go`

```go
package get_personal

import (
    "context"
    "backend/internal/modules/history/domain"
    shared "backend/internal/shared/domain"
    "backend/internal/infrastructure/config"
)

// UseCase handles personal history retrieval
type UseCase struct {
    spinLogRepo domain.SpinLogRepository
    paginationCfg *config.PaginationConfig
}

func New(repo domain.SpinLogRepository, cfg *config.PaginationConfig) *UseCase

// Execute retrieves paginated personal spin history
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
    // 1. Validate player ID
    // 2. Build pagination params
    // 3. Call repository
    // 4. Map to response DTO
}
```

**Status:** ⬜ Not Started

---

#### Task 5.6: Create History DTOs

**File:** `backend/internal/modules/history/application/dto.go`

```go
package application

import (
    "time"
    "backend/internal/shared/constants"
)

// Global History Request
type GetGlobalRequest struct {
    Limit  int `query:"limit"`
    Offset int `query:"offset"`
}

// Personal History Request
type GetPersonalRequest struct {
    PlayerID string `params:"player_id"`
    Limit    int    `query:"limit"`
    Offset   int    `query:"offset"`
}

// SpinLogDTO for global history (includes player name)
type GlobalSpinLogDTO struct {
    ID             string    `json:"id"`
    PlayerNickname string    `json:"player_nickname"`
    PointsGained   int       `json:"points_gained"`
    Source         string    `json:"source"`
    CreatedAt      time.Time `json:"created_at"`
}

// SpinLogDTO for personal history
type PersonalSpinLogDTO struct {
    ID           string    `json:"id"`
    PointsGained int       `json:"points_gained"`
    Source       string    `json:"source"`
    CreatedAt    time.Time `json:"created_at"`
}

// GlobalHistoryResponse
type GlobalHistoryResponse struct {
    Data   []GlobalSpinLogDTO `json:"data"`
    Total  int64              `json:"total"`
    Limit  int                `json:"limit"`
    Offset int                `json:"offset"`
}

// PersonalHistoryResponse
type PersonalHistoryResponse struct {
    Data   []PersonalSpinLogDTO `json:"data"`
    Total  int64                `json:"total"`
    Limit  int                  `json:"limit"`
    Offset int                  `json:"offset"`
}
```

**Status:** ⬜ Not Started

---

### 5C. Adapter Layer

#### Task 5.7: Create SpinLogModel (GORM)

**File:** `backend/internal/modules/history/adapter/repository/spin_log_model.go`

```go
package repository

import (
    "time"
    "backend/internal/shared/constants"
)

// SpinLogModel is the GORM database model
type SpinLogModel struct {
    ID           string    `gorm:"type:uuid;primaryKey"`
    PlayerID     string    `gorm:"type:uuid;not null;index:idx_spin_logs_player_id"`
    PointsGained int       `gorm:"type:integer;not null"`
    Source       string    `gorm:"type:varchar(20);not null"`
    CreatedAt    time.Time `gorm:"not null;index:idx_spin_logs_created_at"`
    
    // For JOIN queries
    Player *PlayerModelRef `gorm:"foreignKey:PlayerID"`
}

func (SpinLogModel) TableName() string {
    return constants.TableSpinLogs
}

// PlayerModelRef for JOIN (read-only)
type PlayerModelRef struct {
    ID       string `gorm:"type:uuid;primaryKey"`
    Nickname string `gorm:"type:varchar(50)"`
}

func (PlayerModelRef) TableName() string {
    return constants.TablePlayers
}
```

**Status:** ⬜ Not Started

---

#### Task 5.8: Implement SpinLogRepositoryGorm

**File:** `backend/internal/modules/history/adapter/repository/spin_log_repository_gorm.go`

```go
package repository

import (
    "context"
    "time"
    "gorm.io/gorm"
    "backend/internal/modules/history/domain"
    shared "backend/internal/shared/domain"
)

type SpinLogRepositoryGorm struct {
    db *gorm.DB
}

func NewSpinLogRepositoryGorm(db *gorm.DB) *SpinLogRepositoryGorm

func (r *SpinLogRepositoryGorm) Store(ctx context.Context, spinLog *domain.SpinLog) error

func (r *SpinLogRepositoryGorm) FindByID(ctx context.Context, id *domain.SpinLogID) (*domain.SpinLog, error)

// ListAll with JOIN to get player nickname
func (r *SpinLogRepositoryGorm) ListAll(ctx context.Context, params shared.PaginationParams) (*domain.SpinLogListResult, error) {
    var models []*SpinLogModel
    var total int64
    
    // Count total
    r.db.WithContext(ctx).Model(&SpinLogModel{}).Count(&total)
    
    // Query with preload
    err := r.db.WithContext(ctx).
        Preload("Player").
        Order("created_at DESC").
        Limit(params.Limit).
        Offset(params.Offset).
        Find(&models).Error
    
    // Map to domain
    // ...
}

// ListByPlayer without JOIN (we already know the player)
func (r *SpinLogRepositoryGorm) ListByPlayer(ctx context.Context, playerID string, params shared.PaginationParams) (*domain.SpinLogListResult, error)

// CountTodayByPlayer for daily limit check
func (r *SpinLogRepositoryGorm) CountTodayByPlayer(ctx context.Context, playerID string) (int, error) {
    var count int64
    today := time.Now().Truncate(24 * time.Hour)
    tomorrow := today.Add(24 * time.Hour)
    
    err := r.db.WithContext(ctx).
        Model(&SpinLogModel{}).
        Where("player_id = ? AND created_at >= ? AND created_at < ?", playerID, today, tomorrow).
        Count(&count).Error
    
    return int(count), err
}
```

**Status:** ⬜ Not Started

---

#### Task 5.9: Create HistoryHandler

**File:** `backend/internal/modules/history/adapter/handler/history_handler.go`

```go
package handler

import (
    "github.com/gofiber/fiber/v2"
    "backend/internal/modules/history/application/get_global"
    "backend/internal/modules/history/application/get_personal"
    httputil "backend/internal/shared/http"
)

type HistoryHandler struct {
    getGlobalUC   *get_global.UseCase
    getPersonalUC *get_personal.UseCase
}

func NewHistoryHandler(
    getGlobalUC *get_global.UseCase,
    getPersonalUC *get_personal.UseCase,
) *HistoryHandler

// GetGlobal handles GET /history/global
func (h *HistoryHandler) GetGlobal(c *fiber.Ctx) error {
    // 1. Parse query params (limit, offset)
    // 2. Execute usecase
    // 3. Return paginated response
}

// GetPersonal handles GET /history/:player_id
func (h *HistoryHandler) GetPersonal(c *fiber.Ctx) error {
    // 1. Parse player_id from URL
    // 2. Parse query params (limit, offset)
    // 3. Execute usecase
    // 4. Return paginated response
}
```

**Status:** ⬜ Not Started

---

#### Task 5.10: Register History Routes

**File:** `backend/internal/modules/history/adapter/handler/routes.go`

```go
package handler

import "github.com/gofiber/fiber/v2"

func (h *HistoryHandler) RegisterRoutes(app *fiber.App) {
    history := app.Group("/history")
    
    history.Get("/global", h.GetGlobal)
    history.Get("/:player_id", h.GetPersonal)
}
```

**File:** `backend/internal/modules/history/module.go`

```go
package history

import (
    "gorm.io/gorm"
    "github.com/gofiber/fiber/v2"
    "backend/internal/infrastructure/config"
    "backend/internal/modules/history/adapter/repository"
    "backend/internal/modules/history/adapter/handler"
    "backend/internal/modules/history/application/get_global"
    "backend/internal/modules/history/application/get_personal"
)

type Module struct {
    Handler     *handler.HistoryHandler
    SpinLogRepo *repository.SpinLogRepositoryGorm  // Exported for Game module
}

func NewModule(db *gorm.DB, cfg *config.Config) *Module {
    repo := repository.NewSpinLogRepositoryGorm(db)
    
    getGlobalUC := get_global.New(repo, &cfg.Pagination)
    getPersonalUC := get_personal.New(repo, &cfg.Pagination)
    
    h := handler.NewHistoryHandler(getGlobalUC, getPersonalUC)
    
    return &Module{
        Handler:     h,
        SpinLogRepo: repo,
    }
}

func (m *Module) RegisterRoutes(app *fiber.App) {
    m.Handler.RegisterRoutes(app)
}
```

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] SpinLog entity validates source is valid SpinSource
- [ ] Global history includes player nicknames (JOIN)
- [ ] Personal history is player-specific
- [ ] Pagination uses config defaults
- [ ] Pagination respects max_limit
- [ ] Results ordered by created_at DESC
- [ ] CountTodayByPlayer works correctly for daily limit
- [ ] No hardcoded pagination values

---

## File Structure After Phase 5

```
backend/internal/modules/history/
├── domain/
│   ├── spin_log.go
│   ├── value_objects.go
│   └── repository.go
├── application/
│   ├── dto.go
│   ├── get_global/
│   │   └── usecase.go
│   └── get_personal/
│       └── usecase.go
├── adapter/
│   ├── repository/
│   │   ├── spin_log_model.go
│   │   └── spin_log_repository_gorm.go
│   └── handler/
│       ├── history_handler.go
│       └── routes.go
└── module.go
```
