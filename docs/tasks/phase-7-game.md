# Phase 7: Game Module (Spin Logic)

**Difficulty:** ⭐⭐⭐⭐⭐ (Hardest)  
**Tasks:** 15  
**Dependencies:** Phase 2, Phase 3, Phase 5

---

## Objective

Implement Game bounded context with weighted random spin logic.

**Endpoint:**
- `POST /game/spin` - Execute spin (weighted random points)

---

## Tasks

### 7A. Domain Layer

#### Task 7.1: Create SpinResult Value Object

**File:** `backend/internal/modules/game/domain/value_objects.go`

```go
package domain

import (
    "time"
    shared "backend/internal/shared/domain"
)

// SpinResult represents the outcome of a spin
type SpinResult struct {
    spinLogID       string
    pointsGained    *shared.Points
    totalPointsAfter *shared.Points
    spunAt          time.Time
}

func NewSpinResult(
    spinLogID string,
    pointsGained *shared.Points,
    totalPointsAfter *shared.Points,
) *SpinResult

// Accessors
func (s *SpinResult) SpinLogID() string
func (s *SpinResult) PointsGained() *shared.Points
func (s *SpinResult) TotalPointsAfter() *shared.Points
func (s *SpinResult) SpunAt() time.Time
```

**Status:** ⬜ Not Started

---

#### Task 7.2: Create SpinDistribution Value Object

**File:** `backend/internal/modules/game/domain/spin_distribution.go`

```go
package domain

import (
    "errors"
    "backend/internal/infrastructure/config"
)

// SpinDistributionItem represents a weighted outcome
type SpinDistributionItem struct {
    Points int
    Weight int
}

// SpinDistribution encapsulates weighted random logic
type SpinDistribution struct {
    items       []SpinDistributionItem
    totalWeight int
}

// NewSpinDistribution creates from config
func NewSpinDistribution(items []config.SpinDistributionItem) (*SpinDistribution, error) {
    if len(items) == 0 {
        return nil, errors.New("distribution must have at least one item")
    }
    
    dist := &SpinDistribution{
        items: make([]SpinDistributionItem, len(items)),
    }
    
    for i, item := range items {
        if item.Points <= 0 || item.Weight <= 0 {
            return nil, errors.New("points and weight must be positive")
        }
        dist.items[i] = SpinDistributionItem{
            Points: item.Points,
            Weight: item.Weight,
        }
        dist.totalWeight += item.Weight
    }
    
    return dist, nil
}

// Items returns copy of distribution items
func (d *SpinDistribution) Items() []SpinDistributionItem

// TotalWeight returns sum of all weights
func (d *SpinDistribution) TotalWeight() int
```

**Status:** ⬜ Not Started

---

#### Task 7.3: Create SpinDomainService

**File:** `backend/internal/modules/game/domain/spin_service.go`

```go
package domain

import (
    "math/rand"
    "time"
    shared "backend/internal/shared/domain"
)

// RandomGenerator interface for testability
type RandomGenerator interface {
    Intn(n int) int
}

// DefaultRandomGenerator uses math/rand
type DefaultRandomGenerator struct {
    rng *rand.Rand
}

func NewDefaultRandomGenerator() *DefaultRandomGenerator {
    return &DefaultRandomGenerator{
        rng: rand.New(rand.NewSource(time.Now().UnixNano())),
    }
}

func (g *DefaultRandomGenerator) Intn(n int) int {
    return g.rng.Intn(n)
}

// SpinDomainService handles spin logic
type SpinDomainService struct {
    distribution *SpinDistribution
    randomGen    RandomGenerator
}

func NewSpinDomainService(dist *SpinDistribution, rng RandomGenerator) *SpinDomainService

// Spin performs weighted random selection
func (s *SpinDomainService) Spin() (*shared.Points, error) {
    // Weighted random algorithm:
    // 1. Generate random number from 0 to totalWeight-1
    // 2. Iterate through items, subtracting weights
    // 3. Return points when random < 0
    
    random := s.randomGen.Intn(s.distribution.TotalWeight())
    
    for _, item := range s.distribution.Items() {
        random -= item.Weight
        if random < 0 {
            return shared.NewPoints(item.Points)
        }
    }
    
    // Fallback to last item (shouldn't happen)
    lastItem := s.distribution.Items()[len(s.distribution.Items())-1]
    return shared.NewPoints(lastItem.Points)
}
```

**Status:** ⬜ Not Started

---

#### Task 7.4: Create DailySpinLimit Specification

**File:** `backend/internal/modules/game/domain/daily_limit.go`

```go
package domain

import "context"

// DailySpinLimitChecker interface for checking daily limit
type DailySpinLimitChecker interface {
    // CountTodaySpins returns number of spins today for player
    CountTodaySpins(ctx context.Context, playerID string) (int, error)
}

// DailyLimitSpec checks if player has exceeded daily limit
type DailyLimitSpec struct {
    maxDailySpins int
    checker       DailySpinLimitChecker
}

func NewDailyLimitSpec(maxDailySpins int, checker DailySpinLimitChecker) *DailyLimitSpec

// IsSatisfied returns true if player CAN spin (has not exceeded limit)
func (s *DailyLimitSpec) IsSatisfied(ctx context.Context, playerID string) (bool, error) {
    count, err := s.checker.CountTodaySpins(ctx, playerID)
    if err != nil {
        return false, err
    }
    return count < s.maxDailySpins, nil
}

// RemainingSpins returns how many spins left today
func (s *DailyLimitSpec) RemainingSpins(ctx context.Context, playerID string) (int, error) {
    count, err := s.checker.CountTodaySpins(ctx, playerID)
    if err != nil {
        return 0, err
    }
    remaining := s.maxDailySpins - count
    if remaining < 0 {
        return 0, nil
    }
    return remaining, nil
}
```

**Status:** ⬜ Not Started

---

#### Task 7.5: Create Game Domain Events

**File:** `backend/internal/modules/game/domain/events.go`

```go
package domain

import (
    "time"
    shared "backend/internal/shared/domain"
)

// SpinExecutedEvent fired when player spins
type SpinExecutedEvent struct {
    shared.BaseEvent
    PlayerID         string
    PointsGained     int
    TotalPointsAfter int
    Source           string
    SpunAt           time.Time
}

func NewSpinExecutedEvent(
    playerID string,
    pointsGained int,
    totalAfter int,
    source string,
) *SpinExecutedEvent

func (e *SpinExecutedEvent) EventType() string { return "game.spin_executed" }
```

**Status:** ⬜ Not Started

---

### 7B. Application Layer

#### Task 7.6: Create ExecuteSpinUseCase

**File:** `backend/internal/modules/game/application/spin/usecase.go`

```go
package spin

import (
    "context"
    gamedomain "backend/internal/modules/game/domain"
    playerdomain "backend/internal/modules/player/domain"
    historydomain "backend/internal/modules/history/domain"
    shared "backend/internal/shared/domain"
    "backend/internal/shared/constants"
)

// UseCase handles spin execution
type UseCase struct {
    spinService    *gamedomain.SpinDomainService
    dailyLimitSpec *gamedomain.DailyLimitSpec
    playerRepo     playerdomain.PlayerRepository
    spinLogRepo    historydomain.SpinLogRepository
}

func New(
    spinService *gamedomain.SpinDomainService,
    dailyLimitSpec *gamedomain.DailyLimitSpec,
    playerRepo playerdomain.PlayerRepository,
    spinLogRepo historydomain.SpinLogRepository,
) *UseCase

// Execute performs a spin for the player
func (uc *UseCase) Execute(ctx context.Context, req Request) (*Response, error) {
    // 1. Parse player ID
    playerID, err := playerdomain.NewPlayerID(req.PlayerID)
    if err != nil {
        return nil, shared.ErrPlayerNotFound
    }
    
    // 2. Get player
    player, err := uc.playerRepo.FindByID(ctx, playerID)
    if err != nil {
        return nil, shared.ErrPlayerNotFound
    }
    
    // 3. Check daily limit
    canSpin, err := uc.dailyLimitSpec.IsSatisfied(ctx, req.PlayerID)
    if err != nil {
        return nil, err
    }
    if !canSpin {
        return nil, shared.ErrDailyLimitExceeded
    }
    
    // 4. Execute spin (weighted random)
    pointsGained, err := uc.spinService.Spin()
    if err != nil {
        return nil, err
    }
    
    // 5. Add points to player
    if err := player.AddPoints(pointsGained); err != nil {
        return nil, err
    }
    
    // 6. Update player
    if err := uc.playerRepo.Update(ctx, player); err != nil {
        return nil, err
    }
    
    // 7. Create spin log
    spinLog, _ := historydomain.NewSpinLog(
        req.PlayerID,
        pointsGained.Value(),
        constants.SpinSourceGame,
    )
    if err := uc.spinLogRepo.Store(ctx, spinLog); err != nil {
        return nil, err
    }
    
    // 8. Return result
    return &Response{
        SpinID:           spinLog.ID().String(),
        PointsGained:     pointsGained.Value(),
        TotalPointsAfter: player.TotalPoints().Value(),
    }, nil
}
```

**Status:** ⬜ Not Started

---

#### Task 7.7: Create Spin DTOs

**File:** `backend/internal/modules/game/application/dto.go`

```go
package application

// SpinRequest for POST /game/spin
type SpinRequest struct {
    PlayerID string `json:"player_id" validate:"required,uuid"`
}

// SpinResponse
type SpinResponse struct {
    SpinID           string `json:"spin_id"`
    PointsGained     int    `json:"points_gained"`
    TotalPointsAfter int    `json:"total_points_after"`
}

// SpinErrorResponse for 429 Too Many Requests
type SpinErrorResponse struct {
    Code           string `json:"code"`
    Message        string `json:"message"`
    RemainingSpins int    `json:"remaining_spins"`
}
```

**Status:** ⬜ Not Started

---

#### Task 7.8: Implement Daily Limit Check Adapter

**File:** `backend/internal/modules/game/adapter/daily_limit_checker.go`

```go
package adapter

import (
    "context"
    historydomain "backend/internal/modules/history/domain"
)

// SpinLogDailyLimitChecker adapts SpinLogRepository to DailySpinLimitChecker
type SpinLogDailyLimitChecker struct {
    spinLogRepo historydomain.SpinLogRepository
}

func NewSpinLogDailyLimitChecker(repo historydomain.SpinLogRepository) *SpinLogDailyLimitChecker

func (c *SpinLogDailyLimitChecker) CountTodaySpins(ctx context.Context, playerID string) (int, error) {
    return c.spinLogRepo.CountTodayByPlayer(ctx, playerID)
}
```

**Status:** ⬜ Not Started

---

### 7C. Adapter Layer

#### Task 7.9: Create GameHandler

**File:** `backend/internal/modules/game/adapter/handler/game_handler.go`

```go
package handler

import (
    "errors"
    "github.com/gofiber/fiber/v2"
    "backend/internal/modules/game/application/spin"
    httputil "backend/internal/shared/http"
    shared "backend/internal/shared/domain"
    "backend/internal/shared/constants"
)

type GameHandler struct {
    spinUC *spin.UseCase
}

func NewGameHandler(spinUC *spin.UseCase) *GameHandler

// Spin handles POST /game/spin
func (h *GameHandler) Spin(c *fiber.Ctx) error {
    // 1. Parse request body
    var req spin.Request
    if err := c.BodyParser(&req); err != nil {
        return httputil.BadRequest(c, constants.ErrCodeValidationFailed, "Invalid request body")
    }
    
    // 2. Validate
    // ...
    
    // 3. Execute usecase
    resp, err := h.spinUC.Execute(c.Context(), req)
    if err != nil {
        // Handle specific errors
        if errors.Is(err, shared.ErrPlayerNotFound) {
            return httputil.NotFound(c, constants.ErrCodePlayerNotFound, err.Error())
        }
        if errors.Is(err, shared.ErrDailyLimitExceeded) {
            return httputil.TooManyRequests(c, constants.ErrCodeDailyLimitExceeded, "Daily spin limit exceeded")
        }
        return httputil.InternalError(c, err.Error())
    }
    
    // 4. Return success
    return httputil.Success(c, constants.StatusOK, resp)
}
```

**Status:** ⬜ Not Started

---

#### Task 7.10: Register Game Routes

**File:** `backend/internal/modules/game/adapter/handler/routes.go`

```go
package handler

import "github.com/gofiber/fiber/v2"

func (h *GameHandler) RegisterRoutes(app *fiber.App) {
    game := app.Group("/game")
    
    game.Post("/spin", h.Spin)
}
```

**File:** `backend/internal/modules/game/module.go`

```go
package game

import (
    "gorm.io/gorm"
    "github.com/gofiber/fiber/v2"
    "backend/internal/infrastructure/config"
    "backend/internal/modules/game/domain"
    "backend/internal/modules/game/adapter"
    "backend/internal/modules/game/adapter/handler"
    "backend/internal/modules/game/application/spin"
    playerdomain "backend/internal/modules/player/domain"
    historydomain "backend/internal/modules/history/domain"
)

type Module struct {
    Handler *handler.GameHandler
}

func NewModule(
    db *gorm.DB,
    cfg *config.Config,
    playerRepo playerdomain.PlayerRepository,
    spinLogRepo historydomain.SpinLogRepository,
) *Module {
    // Create spin distribution from config
    distribution, _ := domain.NewSpinDistribution(cfg.Game.Spin.Distribution)
    
    // Create random generator
    randomGen := domain.NewDefaultRandomGenerator()
    
    // Create spin service
    spinService := domain.NewSpinDomainService(distribution, randomGen)
    
    // Create daily limit checker
    dailyChecker := adapter.NewSpinLogDailyLimitChecker(spinLogRepo)
    
    // Create daily limit spec from config
    dailyLimitSpec := domain.NewDailyLimitSpec(cfg.Game.Spin.MaxDailySpins, dailyChecker)
    
    // Create usecase
    spinUC := spin.New(spinService, dailyLimitSpec, playerRepo, spinLogRepo)
    
    // Create handler
    h := handler.NewGameHandler(spinUC)
    
    return &Module{Handler: h}
}

func (m *Module) RegisterRoutes(app *fiber.App) {
    m.Handler.RegisterRoutes(app)
}
```

**Status:** ⬜ Not Started

---

### 7D. Weighted Random Implementation & Testing

#### Task 7.11: Implement Weighted Random Algorithm

**File:** `backend/internal/modules/game/domain/spin_service.go` (extend)

Ensure the weighted random algorithm is correct:

```go
// Spin performs weighted random selection
// Algorithm: Cumulative distribution
// Example: [300:40, 500:35, 1000:20, 3000:5] → total=100
// Random=30 → 30-40<0 → return 300
// Random=50 → 50-40=10, 10-35<0 → return 500
// Random=80 → 80-40=40, 40-35=5, 5-20<0 → return 1000
// Random=99 → 99-40=59, 59-35=24, 24-20=4, 4-5<0 → return 3000
func (s *SpinDomainService) Spin() (*shared.Points, error) {
    random := s.randomGen.Intn(s.distribution.TotalWeight())
    
    for _, item := range s.distribution.Items() {
        random -= item.Weight
        if random < 0 {
            return shared.NewPoints(item.Points)
        }
    }
    
    // Fallback (edge case)
    lastIdx := len(s.distribution.Items()) - 1
    return shared.NewPoints(s.distribution.Items()[lastIdx].Points)
}
```

**Status:** ⬜ Not Started

---

#### Task 7.12: Unit Test Weighted Random Distribution

**File:** `backend/internal/modules/game/domain/spin_service_test.go`

```go
package domain_test

import (
    "testing"
    "backend/internal/modules/game/domain"
    "backend/internal/infrastructure/config"
    "github.com/stretchr/testify/assert"
)

// MockRandomGenerator for deterministic testing
type MockRandomGenerator struct {
    values []int
    index  int
}

func (m *MockRandomGenerator) Intn(n int) int {
    val := m.values[m.index % len(m.values)]
    m.index++
    return val % n
}

func TestSpinService_WeightedRandom(t *testing.T) {
    // Setup distribution: 300:40, 500:35, 1000:20, 3000:5 (total=100)
    items := []config.SpinDistributionItem{
        {Points: 300, Weight: 40},
        {Points: 500, Weight: 35},
        {Points: 1000, Weight: 20},
        {Points: 3000, Weight: 5},
    }
    dist, _ := domain.NewSpinDistribution(items)
    
    tests := []struct {
        name     string
        random   int
        expected int
    }{
        {"random=0 → 300", 0, 300},
        {"random=39 → 300", 39, 300},
        {"random=40 → 500", 40, 500},
        {"random=74 → 500", 74, 500},
        {"random=75 → 1000", 75, 1000},
        {"random=94 → 1000", 94, 1000},
        {"random=95 → 3000", 95, 3000},
        {"random=99 → 3000", 99, 3000},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            mockRng := &MockRandomGenerator{values: []int{tt.random}}
            svc := domain.NewSpinDomainService(dist, mockRng)
            
            result, err := svc.Spin()
            assert.NoError(t, err)
            assert.Equal(t, tt.expected, result.Value())
        })
    }
}

func TestSpinService_DistributionStatistics(t *testing.T) {
    // Run 10000 spins and verify distribution is approximately correct
    items := []config.SpinDistributionItem{
        {Points: 300, Weight: 40},
        {Points: 500, Weight: 35},
        {Points: 1000, Weight: 20},
        {Points: 3000, Weight: 5},
    }
    dist, _ := domain.NewSpinDistribution(items)
    rng := domain.NewDefaultRandomGenerator()
    svc := domain.NewSpinDomainService(dist, rng)
    
    counts := make(map[int]int)
    iterations := 10000
    
    for i := 0; i < iterations; i++ {
        result, _ := svc.Spin()
        counts[result.Value()]++
    }
    
    // Check distribution is within acceptable range (±5%)
    assert.InDelta(t, 0.40, float64(counts[300])/float64(iterations), 0.05)
    assert.InDelta(t, 0.35, float64(counts[500])/float64(iterations), 0.05)
    assert.InDelta(t, 0.20, float64(counts[1000])/float64(iterations), 0.05)
    assert.InDelta(t, 0.05, float64(counts[3000])/float64(iterations), 0.03)
}
```

**Status:** ⬜ Not Started

---

#### Task 7.13: Integration Test Full Spin Flow

**File:** `backend/tests/integration/spin_test.go`

```go
package integration_test

import (
    "context"
    "testing"
    // imports...
)

func TestSpinFlow_Success(t *testing.T) {
    // 1. Setup test DB
    // 2. Create player
    // 3. Execute spin
    // 4. Verify:
    //    - Spin log created
    //    - Player points increased
    //    - Response contains correct data
}

func TestSpinFlow_DailyLimitExceeded(t *testing.T) {
    // 1. Setup test DB
    // 2. Create player
    // 3. Execute MAX_DAILY_SPINS times
    // 4. Execute one more time
    // 5. Verify 429 Too Many Requests
}

func TestSpinFlow_PlayerNotFound(t *testing.T) {
    // 1. Setup test DB
    // 2. Execute spin with non-existent player ID
    // 3. Verify 404 Not Found
}
```

**Status:** ⬜ Not Started

---

#### Task 7.14: Create Spin Config Endpoint (Optional)

**File:** `backend/internal/modules/game/adapter/handler/game_handler.go` (extend)

```go
// GetSpinConfig handles GET /game/config (optional, for frontend)
func (h *GameHandler) GetSpinConfig(c *fiber.Ctx) error {
    return httputil.Success(c, constants.StatusOK, fiber.Map{
        "max_daily_spins": h.cfg.Game.Spin.MaxDailySpins,
        "distribution": h.cfg.Game.Spin.Distribution,
    })
}
```

**Status:** ⬜ Not Started

---

#### Task 7.15: Verify Spin Distribution via Admin Endpoint (Optional)

**File:** `backend/internal/modules/game/adapter/handler/game_handler.go` (extend)

```go
// GetDistributionStats handles GET /game/stats (admin only, optional)
func (h *GameHandler) GetDistributionStats(c *fiber.Ctx) error {
    // Return current distribution configuration
    // Useful for admin/debugging
}
```

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] Weighted random algorithm is correct
- [ ] Distribution is configurable via YAML
- [ ] Daily limit is configurable via YAML
- [ ] Daily limit is enforced (429 response)
- [ ] Spin creates SpinLog with source=GAME
- [ ] Player points are updated atomically
- [ ] Unit tests verify distribution accuracy
- [ ] Integration tests cover full flow
- [ ] No hardcoded values (all from config)

---

## File Structure After Phase 7

```
backend/internal/modules/game/
├── domain/
│   ├── value_objects.go
│   ├── spin_distribution.go
│   ├── spin_service.go
│   ├── daily_limit.go
│   └── events.go
├── application/
│   ├── dto.go
│   └── spin/
│       └── usecase.go
├── adapter/
│   ├── daily_limit_checker.go
│   └── handler/
│       ├── game_handler.go
│       └── routes.go
└── module.go
```

---

## Weighted Random Visualization

```
Distribution: [300:40, 500:35, 1000:20, 3000:5]
Total Weight: 100

Random Range Mapping:
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 0────────────────39 │ 40────────────────74 │ 75────────────────94 │ 95───────99 │
│        300 (40%)    │        500 (35%)      │       1000 (20%)     │  3000 (5%) │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
