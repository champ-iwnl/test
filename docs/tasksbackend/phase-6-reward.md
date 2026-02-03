# Phase 6: Reward Module (Claim Logic)

**Difficulty:** ⭐⭐⭐⭐  
**Tasks:** 12  
**Dependencies:** Phase 3, Phase 4, Phase 5

---

## Objective

Implement Reward bounded context for claiming rewards at checkpoints.

**Endpoints:**
- `POST /rewards/claim` - Claim reward at checkpoint
- `GET /rewards/:player_id` - Reward claim history

---

## Tasks

### 6A. Domain Layer

#### Task 6.1: Create RewardTransaction Aggregate

**File:** `backend/internal/modules/reward/domain/reward_transaction.go`

```go
package domain

import (
    "time"
    shared "backend/internal/shared/domain"
)

// RewardTransaction represents a claimed reward
type RewardTransaction struct {
    id            *RewardTransactionID
    playerID      string
    checkpointVal int
    claimedAt     time.Time
    
    // Transient
    domainEvents []shared.DomainEvent
}

// Constructor for new claim
func NewRewardTransaction(playerID string, checkpointVal int) (*RewardTransaction, error)

// Reconstruction from persistence
func ReconstructRewardTransaction(
    id string,
    playerID string,
    checkpointVal int,
    claimedAt time.Time,
) *RewardTransaction

// Accessors
func (r *RewardTransaction) ID() *RewardTransactionID
func (r *RewardTransaction) PlayerID() string
func (r *RewardTransaction) CheckpointVal() int
func (r *RewardTransaction) ClaimedAt() time.Time

// Events
func (r *RewardTransaction) DomainEvents() []shared.DomainEvent
func (r *RewardTransaction) ClearEvents()

// Validation
func (r *RewardTransaction) IsValid() error
```

**Status:** ⬜ Not Started

---

#### Task 6.2: Create RewardTransactionRepository Interface

**File:** `backend/internal/modules/reward/domain/reward_transaction_repository.go`

```go
package domain

import "context"

// RewardTransactionRepository defines persistence contract
type RewardTransactionRepository interface {
    // Store persists a new reward transaction
    Store(ctx context.Context, tx *RewardTransaction) error
    
    // FindByID loads transaction by ID
    FindByID(ctx context.Context, id *RewardTransactionID) (*RewardTransaction, error)
    
    // ExistsByPlayerAndCheckpoint checks if player already claimed this checkpoint
    ExistsByPlayerAndCheckpoint(ctx context.Context, playerID string, checkpointVal int) (bool, error)
    
    // GetClaimedCheckpoints returns all checkpoints claimed by player
    GetClaimedCheckpoints(ctx context.Context, playerID string) ([]int, error)
    
    // ListByPlayer returns all rewards claimed by player with config info
    ListByPlayer(ctx context.Context, playerID string) ([]*RewardTransactionWithConfig, error)
}

// RewardTransactionWithConfig includes reward config details
type RewardTransactionWithConfig struct {
    Transaction       *RewardTransaction
    RewardName        string
    RewardDescription string
}
```

**Status:** ⬜ Not Started

---

#### Task 6.3: Create RewardTransactionID Value Object

**File:** `backend/internal/modules/reward/domain/value_objects.go`

```go
package domain

import (
    "github.com/google/uuid"
)

// RewardTransactionID is a value object for transaction identity
type RewardTransactionID struct {
    value string
}

func NewRewardTransactionID(id string) (*RewardTransactionID, error)
func GenerateRewardTransactionID() *RewardTransactionID
func (r *RewardTransactionID) String() string
func (r *RewardTransactionID) IsZero() bool
```

**Status:** ⬜ Not Started

---

#### Task 6.4: Create Reward Domain Events

**File:** `backend/internal/modules/reward/domain/events.go`

```go
package domain

import (
    "time"
    shared "backend/internal/shared/domain"
)

// RewardClaimedEvent fired when player claims a reward
type RewardClaimedEvent struct {
    shared.BaseEvent
    PlayerID      string
    CheckpointVal int
    RewardName    string
    ClaimedAt     time.Time
}

func NewRewardClaimedEvent(playerID string, checkpointVal int, rewardName string) *RewardClaimedEvent
func (e *RewardClaimedEvent) EventType() string { return "reward.claimed" }
```

**Status:** ⬜ Not Started

---

### 6B. Application Layer

#### Task 6.5: Create ClaimRewardUseCase

**File:** `backend/internal/modules/reward/application/claim/usecase.go`

```go
package claim

import (
    "context"
    "backend/internal/modules/reward/domain"
    playerdomain "backend/internal/modules/player/domain"
    shared "backend/internal/shared/domain"
    "backend/internal/shared/constants"
)

// UseCase handles reward claiming
type UseCase struct {
    rewardTxRepo     domain.RewardTransactionRepository
    rewardConfigRepo domain.RewardConfigRepository
    playerRepo       playerdomain.PlayerRepository
}

func New(
    txRepo domain.RewardTransactionRepository,
    configRepo domain.RewardConfigRepository,
    playerRepo playerdomain.PlayerRepository,
) *UseCase

// Execute claims a reward for player
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
    // 1. Get player
    player, err := uc.playerRepo.FindByID(ctx, playerID)
    if err != nil {
        return nil, shared.ErrPlayerNotFound
    }
    
    // 2. Get reward config for checkpoint
    config, err := uc.rewardConfigRepo.FindByCheckpoint(ctx, req.CheckpointVal)
    if err != nil {
        return nil, shared.ErrInvalidCheckpoint
    }
    
    // 3. Check if player has enough points
    requiredPoints, _ := shared.NewPoints(req.CheckpointVal)
    if !player.TotalPoints().IsGreaterThanOrEqual(requiredPoints) {
        return nil, shared.ErrInsufficientPoints
    }
    
    // 4. Check if already claimed
    exists, _ := uc.rewardTxRepo.ExistsByPlayerAndCheckpoint(ctx, req.PlayerID, req.CheckpointVal)
    if exists {
        return nil, shared.ErrAlreadyClaimed
    }
    
    // 5. Create transaction
    tx, _ := domain.NewRewardTransaction(req.PlayerID, req.CheckpointVal)
    
    // 6. Store
    if err := uc.rewardTxRepo.Store(ctx, tx); err != nil {
        return nil, err
    }
    
    // 7. Return response
    return &Response{
        ID:            tx.ID().String(),
        CheckpointVal: tx.CheckpointVal(),
        RewardName:    config.RewardName(),
        ClaimedAt:     tx.ClaimedAt(),
    }, nil
}
```

**Status:** ⬜ Not Started

---

#### Task 6.6: Create GetRewardHistoryUseCase

**File:** `backend/internal/modules/reward/application/get_history/usecase.go`

```go
package get_history

import (
    "context"
    "backend/internal/modules/reward/domain"
)

// UseCase handles reward history retrieval
type UseCase struct {
    rewardTxRepo domain.RewardTransactionRepository
}

func New(repo domain.RewardTransactionRepository) *UseCase

// Execute retrieves player's reward claim history
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
    // 1. Get all claimed rewards with config info
    // 2. Map to DTOs
    // 3. Return response
}
```

**Status:** ⬜ Not Started

---

#### Task 6.7: Create Reward DTOs

**File:** `backend/internal/modules/reward/application/dto.go`

```go
package application

import "time"

// ClaimRequest for POST /rewards/claim
type ClaimRequest struct {
    PlayerID      string `json:"player_id" validate:"required,uuid"`
    CheckpointVal int    `json:"checkpoint_val" validate:"required,gt=0"`
}

// ClaimResponse
type ClaimResponse struct {
    ID            string    `json:"id"`
    CheckpointVal int       `json:"checkpoint_val"`
    RewardName    string    `json:"reward_name"`
    ClaimedAt     time.Time `json:"claimed_at"`
}

// GetHistoryRequest for GET /rewards/:player_id
type GetHistoryRequest struct {
    PlayerID string `params:"player_id" validate:"required,uuid"`
}

// RewardHistoryDTO
type RewardHistoryDTO struct {
    ID                string    `json:"id"`
    CheckpointVal     int       `json:"checkpoint_val"`
    RewardName        string    `json:"reward_name"`
    RewardDescription string    `json:"reward_description"`
    ClaimedAt         time.Time `json:"claimed_at"`
}

// GetHistoryResponse
type GetHistoryResponse struct {
    Data []RewardHistoryDTO `json:"data"`
}
```

**Status:** ⬜ Not Started

---

### 6C. Adapter Layer

#### Task 6.8: Create RewardTransactionModel (GORM)

**File:** `backend/internal/modules/reward/adapter/repository/reward_transaction_model.go`

```go
package repository

import (
    "time"
    "backend/internal/shared/constants"
)

// RewardTransactionModel is the GORM database model
type RewardTransactionModel struct {
    ID            string    `gorm:"type:uuid;primaryKey"`
    PlayerID      string    `gorm:"type:uuid;not null;index"`
    CheckpointVal int       `gorm:"type:integer;not null"`
    ClaimedAt     time.Time `gorm:"not null"`
    
    // For JOIN queries
    RewardConfig *RewardConfigModel `gorm:"foreignKey:CheckpointVal;references:CheckpointVal"`
}

func (RewardTransactionModel) TableName() string {
    return constants.TableRewardTransactions
}
```

**Status:** ⬜ Not Started

---

#### Task 6.9: Implement RewardTransactionRepositoryGorm

**File:** `backend/internal/modules/reward/adapter/repository/reward_transaction_repository_gorm.go`

```go
package repository

import (
    "context"
    "gorm.io/gorm"
    "backend/internal/modules/reward/domain"
)

type RewardTransactionRepositoryGorm struct {
    db *gorm.DB
}

func NewRewardTransactionRepositoryGorm(db *gorm.DB) *RewardTransactionRepositoryGorm

func (r *RewardTransactionRepositoryGorm) Store(ctx context.Context, tx *domain.RewardTransaction) error

func (r *RewardTransactionRepositoryGorm) FindByID(ctx context.Context, id *domain.RewardTransactionID) (*domain.RewardTransaction, error)

// ExistsByPlayerAndCheckpoint uses unique constraint check
func (r *RewardTransactionRepositoryGorm) ExistsByPlayerAndCheckpoint(ctx context.Context, playerID string, checkpointVal int) (bool, error) {
    var count int64
    err := r.db.WithContext(ctx).
        Model(&RewardTransactionModel{}).
        Where("player_id = ? AND checkpoint_val = ?", playerID, checkpointVal).
        Count(&count).Error
    return count > 0, err
}

// GetClaimedCheckpoints returns just the checkpoint values
func (r *RewardTransactionRepositoryGorm) GetClaimedCheckpoints(ctx context.Context, playerID string) ([]int, error) {
    var checkpoints []int
    err := r.db.WithContext(ctx).
        Model(&RewardTransactionModel{}).
        Where("player_id = ?", playerID).
        Pluck("checkpoint_val", &checkpoints).Error
    return checkpoints, err
}

// ListByPlayer with JOIN to get reward config
func (r *RewardTransactionRepositoryGorm) ListByPlayer(ctx context.Context, playerID string) ([]*domain.RewardTransactionWithConfig, error) {
    var models []*RewardTransactionModel
    err := r.db.WithContext(ctx).
        Preload("RewardConfig").
        Where("player_id = ?", playerID).
        Order("claimed_at DESC").
        Find(&models).Error
    // Map to domain...
}
```

**Status:** ⬜ Not Started

---

#### Task 6.10: Create RewardHandler

**File:** `backend/internal/modules/reward/adapter/handler/reward_handler.go`

```go
package handler

import (
    "github.com/gofiber/fiber/v2"
    "backend/internal/modules/reward/application/claim"
    "backend/internal/modules/reward/application/get_history"
    httputil "backend/internal/shared/http"
    "backend/internal/shared/constants"
)

type RewardHandler struct {
    claimUC      *claim.UseCase
    getHistoryUC *get_history.UseCase
}

func NewRewardHandler(claimUC *claim.UseCase, getHistoryUC *get_history.UseCase) *RewardHandler

// Claim handles POST /rewards/claim
func (h *RewardHandler) Claim(c *fiber.Ctx) error {
    // 1. Parse request body
    // 2. Validate
    // 3. Execute usecase
    // 4. Handle errors:
    //    - ErrPlayerNotFound → 404
    //    - ErrInvalidCheckpoint → 400
    //    - ErrInsufficientPoints → 400
    //    - ErrAlreadyClaimed → 409 Conflict
    // 5. Return success response
}

// GetHistory handles GET /rewards/:player_id
func (h *RewardHandler) GetHistory(c *fiber.Ctx) error {
    // 1. Parse player_id from URL
    // 2. Execute usecase
    // 3. Return response
}
```

**Status:** ⬜ Not Started

---

#### Task 6.11: Register Reward Routes

**File:** `backend/internal/modules/reward/adapter/handler/routes.go`

```go
package handler

import "github.com/gofiber/fiber/v2"

func (h *RewardHandler) RegisterRoutes(app *fiber.App) {
    rewards := app.Group("/rewards")
    
    rewards.Post("/claim", h.Claim)
    rewards.Get("/:player_id", h.GetHistory)
}
```

**File:** `backend/internal/modules/reward/module.go`

```go
package reward

import (
    "gorm.io/gorm"
    "github.com/gofiber/fiber/v2"
    "backend/internal/infrastructure/config"
    "backend/internal/modules/reward/domain"
    "backend/internal/modules/reward/adapter/repository"
    "backend/internal/modules/reward/adapter/handler"
    "backend/internal/modules/reward/application/claim"
    "backend/internal/modules/reward/application/get_history"
    playerdomain "backend/internal/modules/player/domain"
)

type Module struct {
    Handler          *handler.RewardHandler
    RewardConfigRepo domain.RewardConfigRepository
    RewardTxRepo     domain.RewardTransactionRepository
}

func NewModule(
    db *gorm.DB,
    cfg *config.Config,
    playerRepo playerdomain.PlayerRepository,
) *Module {
    configRepo := repository.NewRewardConfigRepositoryGorm(db)
    txRepo := repository.NewRewardTransactionRepositoryGorm(db)
    
    claimUC := claim.New(txRepo, configRepo, playerRepo)
    getHistoryUC := get_history.New(txRepo)
    
    h := handler.NewRewardHandler(claimUC, getHistoryUC)
    
    return &Module{
        Handler:          h,
        RewardConfigRepo: configRepo,
        RewardTxRepo:     txRepo,
    }
}

func (m *Module) RegisterRoutes(app *fiber.App) {
    m.Handler.RegisterRoutes(app)
}
```

**Status:** ⬜ Not Started

---

#### Task 6.12: Update GetProfileUseCase with Claimed Checkpoints

**File:** `backend/internal/modules/player/application/get_profile/usecase.go` (final update)

```go
package get_profile

import (
    "context"
    "backend/internal/modules/player/domain"
    rewarddomain "backend/internal/modules/reward/domain"
)

type UseCase struct {
    playerRepo       domain.PlayerRepository
    rewardConfigRepo rewarddomain.RewardConfigRepository
    rewardTxRepo     rewarddomain.RewardTransactionRepository  // NEW
}

func New(
    playerRepo domain.PlayerRepository,
    rewardConfigRepo rewarddomain.RewardConfigRepository,
    rewardTxRepo rewarddomain.RewardTransactionRepository,  // NEW
) *UseCase

func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
    // 1. Get player
    player, err := uc.playerRepo.FindByID(ctx, playerID)
    
    // 2. Get claimed checkpoints
    claimedCheckpoints, err := uc.rewardTxRepo.GetClaimedCheckpoints(ctx, req.PlayerID)
    
    // 3. Return complete profile
    return &Response{
        ID:                 player.ID().String(),
        Nickname:           player.Nickname().String(),
        TotalPoints:        player.TotalPoints().Value(),
        CreatedAt:          player.CreatedAt(),
        ClaimedCheckpoints: claimedCheckpoints,
    }, nil
}
```

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] RewardTransaction enforces unique constraint (player_id, checkpoint_val)
- [ ] ClaimReward checks player has enough points
- [ ] ClaimReward returns 409 Conflict if already claimed
- [ ] ClaimReward returns 400 if insufficient points
- [ ] GetRewardHistory includes reward config details
- [ ] GetProfile now includes claimed checkpoints
- [ ] Domain events emitted on claim
- [ ] No hardcoded checkpoint values

---

## File Structure After Phase 6

```
backend/internal/modules/reward/
├── domain/
│   ├── reward_config.go
│   ├── reward_config_repository.go
│   ├── reward_transaction.go
│   ├── reward_transaction_repository.go
│   ├── value_objects.go
│   └── events.go
├── application/
│   ├── dto.go
│   ├── claim/
│   │   └── usecase.go
│   ├── get_history/
│   │   └── usecase.go
│   └── get_checkpoints/
│       └── usecase.go
├── adapter/
│   ├── repository/
│   │   ├── reward_config_model.go
│   │   ├── reward_config_repository_gorm.go
│   │   ├── reward_transaction_model.go
│   │   └── reward_transaction_repository_gorm.go
│   └── handler/
│       ├── reward_handler.go
│       └── routes.go
└── module.go
```
