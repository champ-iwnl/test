# Phase 4: Reward Config Module

**Difficulty:** ⭐⭐⭐  
**Tasks:** 6  
**Dependencies:** Phase 1, Phase 2

---

## Objective

Implement read-only Reward Configuration module. This stores checkpoint definitions that are seeded from YAML config.

---

## Tasks

### Task 4.1: Create RewardConfig Entity

**File:** `backend/internal/modules/reward/domain/reward_config.go`

```go
package domain

import "time"

// RewardConfig represents a reward checkpoint definition
// This is read-only (seeded from config)
type RewardConfig struct {
    id                int
    checkpointVal     int
    rewardName        string
    rewardDescription string
    createdAt         time.Time
}

// Constructor for reconstruction from DB
func ReconstructRewardConfig(
    id int,
    checkpointVal int,
    rewardName string,
    rewardDescription string,
    createdAt time.Time,
) *RewardConfig

// Accessors
func (r *RewardConfig) ID() int
func (r *RewardConfig) CheckpointVal() int
func (r *RewardConfig) RewardName() string
func (r *RewardConfig) RewardDescription() string
func (r *RewardConfig) CreatedAt() time.Time
```

**Status:** ⬜ Not Started

---

### Task 4.2: Create RewardConfigRepository Interface

**File:** `backend/internal/modules/reward/domain/reward_config_repository.go`

```go
package domain

import "context"

// RewardConfigRepository defines persistence contract for reward configs
type RewardConfigRepository interface {
    // FindByCheckpoint returns config for a specific checkpoint
    FindByCheckpoint(ctx context.Context, checkpointVal int) (*RewardConfig, error)
    
    // FindAll returns all reward configs
    FindAll(ctx context.Context) ([]*RewardConfig, error)
    
    // GetAllCheckpointValues returns just the checkpoint values
    GetAllCheckpointValues(ctx context.Context) ([]int, error)
    
    // Upsert inserts or updates a reward config (for seeding)
    Upsert(ctx context.Context, config *RewardConfig) error
}
```

**Status:** ⬜ Not Started

---

### Task 4.3: Create RewardConfigModel (GORM)

**File:** `backend/internal/modules/reward/adapter/repository/reward_config_model.go`

```go
package repository

import (
    "time"
    "backend/internal/shared/constants"
)

// RewardConfigModel is the GORM database model
type RewardConfigModel struct {
    ID                int       `gorm:"primaryKey;autoIncrement"`
    CheckpointVal     int       `gorm:"uniqueIndex;not null"`
    RewardName        string    `gorm:"type:varchar(100);not null"`
    RewardDescription string    `gorm:"type:text"`
    CreatedAt         time.Time `gorm:"not null"`
}

func (RewardConfigModel) TableName() string {
    return constants.TableRewardConfig
}
```

**Status:** ⬜ Not Started

---

### Task 4.4: Implement RewardConfigRepositoryGorm

**File:** `backend/internal/modules/reward/adapter/repository/reward_config_repository_gorm.go`

```go
package repository

import (
    "context"
    "gorm.io/gorm"
    "gorm.io/gorm/clause"
    "backend/internal/modules/reward/domain"
)

// RewardConfigRepositoryGorm implements domain.RewardConfigRepository
type RewardConfigRepositoryGorm struct {
    db *gorm.DB
}

func NewRewardConfigRepositoryGorm(db *gorm.DB) *RewardConfigRepositoryGorm

func (r *RewardConfigRepositoryGorm) FindByCheckpoint(ctx context.Context, checkpointVal int) (*domain.RewardConfig, error)

func (r *RewardConfigRepositoryGorm) FindAll(ctx context.Context) ([]*domain.RewardConfig, error)

func (r *RewardConfigRepositoryGorm) GetAllCheckpointValues(ctx context.Context) ([]int, error)

// Upsert uses ON CONFLICT DO UPDATE for PostgreSQL
func (r *RewardConfigRepositoryGorm) Upsert(ctx context.Context, config *domain.RewardConfig) error {
    model := r.toModel(config)
    return r.db.WithContext(ctx).
        Clauses(clause.OnConflict{
            Columns:   []clause.Column{{Name: "checkpoint_val"}},
            DoUpdates: clause.AssignmentColumns([]string{"reward_name", "reward_description"}),
        }).
        Create(model).Error
}

// Helper methods
func (r *RewardConfigRepositoryGorm) toModel(config *domain.RewardConfig) *RewardConfigModel
func (r *RewardConfigRepositoryGorm) toDomain(model *RewardConfigModel) *domain.RewardConfig
```

**Status:** ⬜ Not Started

---

### Task 4.5: Create GetCheckpointsUseCase

**File:** `backend/internal/modules/reward/application/get_checkpoints/usecase.go`

```go
package get_checkpoints

import (
    "context"
    "backend/internal/modules/reward/domain"
)

// UseCase returns all available reward checkpoints
type UseCase struct {
    rewardConfigRepo domain.RewardConfigRepository
}

func New(repo domain.RewardConfigRepository) *UseCase

// Execute returns all checkpoint configurations
func (uc *UseCase) Execute(ctx context.Context) (*Response, error)
```

**File:** `backend/internal/modules/reward/application/get_checkpoints/dto.go`

```go
package get_checkpoints

// Response contains all checkpoints
type Response struct {
    Checkpoints []CheckpointDTO `json:"checkpoints"`
}

type CheckpointDTO struct {
    CheckpointVal     int    `json:"checkpoint_val"`
    RewardName        string `json:"reward_name"`
    RewardDescription string `json:"reward_description"`
}
```

**Status:** ⬜ Not Started

---

### Task 4.6: Update GetProfileUseCase for Claimed Checkpoints

**File:** `backend/internal/modules/player/application/get_profile/usecase.go` (extend)

```go
package get_profile

import (
    "context"
    "backend/internal/modules/player/domain"
    rewarddomain "backend/internal/modules/reward/domain"
)

// UseCase handles get player profile
type UseCase struct {
    playerRepo       domain.PlayerRepository
    rewardConfigRepo rewarddomain.RewardConfigRepository
}

func New(
    playerRepo domain.PlayerRepository,
    rewardConfigRepo rewarddomain.RewardConfigRepository,
) *UseCase

// Execute retrieves player profile with available checkpoints
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
    // 1. Get player
    // 2. Get all checkpoints
    // 3. Return profile with checkpoints player can claim
}
```

**Note:** ClaimedCheckpoints will be added in Phase 6 when RewardTransaction is implemented.

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] RewardConfig entity is read-only
- [ ] Repository supports Upsert for seeding
- [ ] GetAllCheckpointValues returns sorted list
- [ ] GetProfileUseCase includes available checkpoints
- [ ] Seeder reads from rewards.yaml config
- [ ] No hardcoded checkpoint values

---

## File Structure After Phase 4

```
backend/internal/modules/reward/
├── domain/
│   ├── reward_config.go
│   └── reward_config_repository.go
├── application/
│   └── get_checkpoints/
│       ├── usecase.go
│       └── dto.go
└── adapter/
    └── repository/
        ├── reward_config_model.go
        └── reward_config_repository_gorm.go
```

---

## Seeder Command

```go
// cmd/seed/main.go
func main() {
    cfg := config.Init()
    db := database.New(cfg)
    
    repo := repository.NewRewardConfigRepositoryGorm(db)
    
    // Read from config
    for _, checkpoint := range cfg.Rewards.Checkpoints {
        rewardConfig := domain.ReconstructRewardConfig(
            0, // auto-increment
            checkpoint.CheckpointVal,
            checkpoint.RewardName,
            checkpoint.RewardDescription,
            time.Now(),
        )
        if err := repo.Upsert(context.Background(), rewardConfig); err != nil {
            log.Fatal(err)
        }
    }
    
    log.Println("Seeding complete")
}
```
