# Phase 8: Testing Suite

**Difficulty:** ⭐⭐⭐  
**Tasks:** 10  
**Dependencies:** All previous phases

---

## Objective

Comprehensive testing suite covering unit, integration, and E2E tests.

---

## Tasks

### 8A. Test Infrastructure

#### Task 8.1: Create Test Fixtures & Helpers

**File:** `backend/tests/fixtures/fixtures.go`

```go
package fixtures

import (
    "context"
    "gorm.io/gorm"
    playerdomain "backend/internal/modules/player/domain"
    historydomain "backend/internal/modules/history/domain"
    rewarddomain "backend/internal/modules/reward/domain"
    "backend/internal/shared/constants"
)

// TestFixtures holds test data factories
type TestFixtures struct {
    db *gorm.DB
}

func NewTestFixtures(db *gorm.DB) *TestFixtures

// CreatePlayer creates a test player with specified points
func (f *TestFixtures) CreatePlayer(ctx context.Context, nickname string, points int) (*playerdomain.Player, error) {
    player, _ := playerdomain.NewPlayer(nickname)
    if points > 0 {
        p, _ := playerdomain.NewPoints(points)
        // Use internal method to set points for testing
    }
    // Save to DB
    return player, nil
}

// CreateSpinLog creates a test spin log
func (f *TestFixtures) CreateSpinLog(ctx context.Context, playerID string, points int, source string) (*historydomain.SpinLog, error)

// CreateRewardTransaction creates a claimed reward
func (f *TestFixtures) CreateRewardTransaction(ctx context.Context, playerID string, checkpoint int) (*rewarddomain.RewardTransaction, error)

// ClearAllTables truncates all tables for fresh test state
func (f *TestFixtures) ClearAllTables(ctx context.Context) error {
    tables := []string{
        constants.TableRewardTransactions,
        constants.TableSpinLogs,
        constants.TablePlayers,
        // Don't clear reward_config (seed data)
    }
    for _, table := range tables {
        if err := f.db.Exec("TRUNCATE TABLE " + table + " CASCADE").Error; err != nil {
            return err
        }
    }
    return nil
}
```

**Status:** ⬜ Not Started

---

#### Task 8.2: Create Test Database Setup

**File:** `backend/tests/testdb/setup.go`

```go
package testdb

import (
    "os"
    "gorm.io/gorm"
    "backend/internal/infrastructure/database"
    "backend/internal/infrastructure/config"
)

var testDB *gorm.DB

// Setup initializes test database connection
func Setup() (*gorm.DB, error) {
    // Use test database (different from production)
    os.Setenv("DB_DATABASE", "spinhead_test")
    
    cfg, err := config.Init()
    if err != nil {
        return nil, err
    }
    
    db, err := database.New(cfg.Database)
    if err != nil {
        return nil, err
    }
    
    testDB = db.DB()
    return testDB, nil
}

// Teardown closes test database connection
func Teardown() {
    if testDB != nil {
        sqlDB, _ := testDB.DB()
        sqlDB.Close()
    }
}

// GetDB returns current test DB instance
func GetDB() *gorm.DB {
    return testDB
}
```

**Status:** ⬜ Not Started

---

#### Task 8.3: Create Mock Repositories

**File:** `backend/tests/mocks/player_repo.go`

```go
package mocks

import (
    "context"
    playerdomain "backend/internal/modules/player/domain"
    "github.com/stretchr/testify/mock"
)

// MockPlayerRepository for unit testing
type MockPlayerRepository struct {
    mock.Mock
}

func (m *MockPlayerRepository) Store(ctx context.Context, player *playerdomain.Player) error {
    args := m.Called(ctx, player)
    return args.Error(0)
}

func (m *MockPlayerRepository) FindByID(ctx context.Context, id playerdomain.PlayerID) (*playerdomain.Player, error) {
    args := m.Called(ctx, id)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*playerdomain.Player), args.Error(1)
}

func (m *MockPlayerRepository) Update(ctx context.Context, player *playerdomain.Player) error {
    args := m.Called(ctx, player)
    return args.Error(0)
}

func (m *MockPlayerRepository) FindByNickname(ctx context.Context, nickname string) (*playerdomain.Player, error) {
    args := m.Called(ctx, nickname)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*playerdomain.Player), args.Error(1)
}
```

**File:** `backend/tests/mocks/spinlog_repo.go`

```go
package mocks

// MockSpinLogRepository...
```

**File:** `backend/tests/mocks/reward_repo.go`

```go
package mocks

// MockRewardTransactionRepository...
// MockRewardConfigRepository...
```

**Status:** ⬜ Not Started

---

### 8B. Unit Tests

#### Task 8.4: Player Domain Unit Tests

**File:** `backend/internal/modules/player/domain/player_test.go`

```go
package domain_test

import (
    "testing"
    "backend/internal/modules/player/domain"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

func TestNewPlayer_ValidNickname(t *testing.T) {
    player, err := domain.NewPlayer("TestUser")
    
    require.NoError(t, err)
    assert.NotEmpty(t, player.ID().String())
    assert.Equal(t, "TestUser", player.Nickname())
    assert.Equal(t, 0, player.TotalPoints().Value())
}

func TestNewPlayer_EmptyNickname(t *testing.T) {
    player, err := domain.NewPlayer("")
    
    assert.Nil(t, player)
    assert.Error(t, err)
}

func TestNewPlayer_NicknameTooLong(t *testing.T) {
    longName := make([]byte, 51)
    for i := range longName {
        longName[i] = 'a'
    }
    
    player, err := domain.NewPlayer(string(longName))
    
    assert.Nil(t, player)
    assert.Error(t, err)
}

func TestPlayer_AddPoints(t *testing.T) {
    player, _ := domain.NewPlayer("TestUser")
    points, _ := domain.NewPoints(100)
    
    err := player.AddPoints(points)
    
    require.NoError(t, err)
    assert.Equal(t, 100, player.TotalPoints().Value())
}

func TestPlayer_AddPoints_Cumulative(t *testing.T) {
    player, _ := domain.NewPlayer("TestUser")
    
    player.AddPoints(domain.MustNewPoints(100))
    player.AddPoints(domain.MustNewPoints(50))
    player.AddPoints(domain.MustNewPoints(25))
    
    assert.Equal(t, 175, player.TotalPoints().Value())
}

func TestPoints_Negative_Invalid(t *testing.T) {
    points, err := domain.NewPoints(-100)
    
    assert.Nil(t, points)
    assert.Error(t, err)
}
```

**Status:** ⬜ Not Started

---

#### Task 8.5: Reward Domain Unit Tests

**File:** `backend/internal/modules/reward/domain/reward_test.go`

```go
package domain_test

import (
    "testing"
    "backend/internal/modules/reward/domain"
    "github.com/stretchr/testify/assert"
)

func TestNewRewardTransaction_Valid(t *testing.T) {
    tx, err := domain.NewRewardTransaction("player-123", 1000)
    
    assert.NoError(t, err)
    assert.NotEmpty(t, tx.ID())
    assert.Equal(t, "player-123", tx.PlayerID())
    assert.Equal(t, 1000, tx.CheckpointValue())
    assert.False(t, tx.ClaimedAt().IsZero())
}

func TestNewRewardTransaction_InvalidCheckpoint(t *testing.T) {
    tx, err := domain.NewRewardTransaction("player-123", 0)
    
    assert.Nil(t, tx)
    assert.Error(t, err)
}

func TestCanClaimReward_NotYetClaimed(t *testing.T) {
    claimedCheckpoints := []int{500, 1000}
    
    canClaim := domain.CanClaimCheckpoint(2000, claimedCheckpoints)
    
    assert.True(t, canClaim)
}

func TestCanClaimReward_AlreadyClaimed(t *testing.T) {
    claimedCheckpoints := []int{500, 1000, 2000}
    
    canClaim := domain.CanClaimCheckpoint(1000, claimedCheckpoints)
    
    assert.False(t, canClaim)
}
```

**Status:** ⬜ Not Started

---

#### Task 8.6: History Domain Unit Tests

**File:** `backend/internal/modules/history/domain/spinlog_test.go`

```go
package domain_test

import (
    "testing"
    "backend/internal/modules/history/domain"
    "backend/internal/shared/constants"
    "github.com/stretchr/testify/assert"
)

func TestNewSpinLog_ValidGameSource(t *testing.T) {
    log, err := domain.NewSpinLog("player-123", 500, constants.SpinSourceGame)
    
    assert.NoError(t, err)
    assert.NotEmpty(t, log.ID())
    assert.Equal(t, "player-123", log.PlayerID())
    assert.Equal(t, 500, log.PointsGained())
    assert.Equal(t, constants.SpinSourceGame, log.Source())
}

func TestNewSpinLog_ValidBonusSource(t *testing.T) {
    log, err := domain.NewSpinLog("player-123", 1000, constants.SpinSourceBonus)
    
    assert.NoError(t, err)
    assert.Equal(t, constants.SpinSourceBonus, log.Source())
}

func TestNewSpinLog_InvalidSource(t *testing.T) {
    log, err := domain.NewSpinLog("player-123", 500, "invalid_source")
    
    assert.Nil(t, log)
    assert.Error(t, err)
}

func TestNewSpinLog_NegativePoints(t *testing.T) {
    log, err := domain.NewSpinLog("player-123", -100, constants.SpinSourceGame)
    
    assert.Nil(t, log)
    assert.Error(t, err)
}
```

**Status:** ⬜ Not Started

---

### 8C. Integration Tests

#### Task 8.7: Player Flow Integration Tests

**File:** `backend/tests/integration/player_test.go`

```go
package integration_test

import (
    "context"
    "testing"
    "backend/tests/testdb"
    "backend/tests/fixtures"
    "backend/internal/modules/player/application/enter"
    "backend/internal/modules/player/application/profile"
    // ... imports
    "github.com/stretchr/testify/suite"
)

type PlayerIntegrationSuite struct {
    suite.Suite
    fixtures *fixtures.TestFixtures
}

func (s *PlayerIntegrationSuite) SetupSuite() {
    db, _ := testdb.Setup()
    s.fixtures = fixtures.NewTestFixtures(db)
}

func (s *PlayerIntegrationSuite) TearDownSuite() {
    testdb.Teardown()
}

func (s *PlayerIntegrationSuite) SetupTest() {
    s.fixtures.ClearAllTables(context.Background())
}

func (s *PlayerIntegrationSuite) TestEnterPlayer_NewPlayer() {
    // 1. Call enter with new nickname
    // 2. Verify player created
    // 3. Verify response has correct structure
}

func (s *PlayerIntegrationSuite) TestEnterPlayer_ExistingPlayer() {
    // 1. Create player first
    // 2. Call enter with same nickname
    // 3. Verify same player returned (resume)
}

func (s *PlayerIntegrationSuite) TestGetProfile_WithClaimedRewards() {
    // 1. Create player with points
    // 2. Claim some rewards
    // 3. Get profile
    // 4. Verify claimed_checkpoints included
}

func TestPlayerIntegration(t *testing.T) {
    suite.Run(t, new(PlayerIntegrationSuite))
}
```

**Status:** ⬜ Not Started

---

#### Task 8.8: Reward Flow Integration Tests

**File:** `backend/tests/integration/reward_test.go`

```go
package integration_test

import (
    "context"
    "testing"
    "backend/tests/testdb"
    "backend/tests/fixtures"
    "github.com/stretchr/testify/suite"
)

type RewardIntegrationSuite struct {
    suite.Suite
    fixtures *fixtures.TestFixtures
}

func (s *RewardIntegrationSuite) SetupSuite() {
    db, _ := testdb.Setup()
    s.fixtures = fixtures.NewTestFixtures(db)
}

func (s *RewardIntegrationSuite) SetupTest() {
    s.fixtures.ClearAllTables(context.Background())
}

func (s *RewardIntegrationSuite) TestClaimReward_Success() {
    // 1. Create player with 1500 points
    // 2. Claim checkpoint 1000
    // 3. Verify transaction created
    // 4. Verify response has reward details
}

func (s *RewardIntegrationSuite) TestClaimReward_InsufficientPoints() {
    // 1. Create player with 500 points
    // 2. Try to claim checkpoint 1000
    // 3. Verify 400 Bad Request
}

func (s *RewardIntegrationSuite) TestClaimReward_AlreadyClaimed() {
    // 1. Create player with 2000 points
    // 2. Claim checkpoint 1000
    // 3. Try to claim checkpoint 1000 again
    // 4. Verify 409 Conflict
}

func (s *RewardIntegrationSuite) TestGetClaimHistory() {
    // 1. Create player
    // 2. Claim multiple rewards
    // 3. Get claim history
    // 4. Verify all claims returned with reward details
}

func TestRewardIntegration(t *testing.T) {
    suite.Run(t, new(RewardIntegrationSuite))
}
```

**Status:** ⬜ Not Started

---

### 8D. E2E Tests

#### Task 8.9: Full Game Flow E2E Test

**File:** `backend/tests/e2e/full_flow_test.go`

```go
package e2e_test

import (
    "bytes"
    "encoding/json"
    "net/http/httptest"
    "testing"
    "github.com/gofiber/fiber/v2"
    "github.com/stretchr/testify/suite"
)

type E2ESuite struct {
    suite.Suite
    app *fiber.App
}

func (s *E2ESuite) SetupSuite() {
    // Initialize full app with test DB
}

func (s *E2ESuite) TestFullGameFlow() {
    // 1. Enter game (POST /players/enter)
    resp := s.postJSON("/players/enter", map[string]string{
        "nickname": "E2EPlayer",
    })
    s.Equal(200, resp.StatusCode)
    playerID := extractPlayerID(resp)
    
    // 2. Get profile (GET /players/:id)
    resp = s.get("/players/" + playerID)
    s.Equal(200, resp.StatusCode)
    
    // 3. Spin multiple times (POST /game/spin)
    totalPoints := 0
    for i := 0; i < 5; i++ {
        resp = s.postJSON("/game/spin", map[string]string{
            "player_id": playerID,
        })
        s.Equal(200, resp.StatusCode)
        totalPoints = extractTotalPoints(resp)
    }
    
    // 4. Check history (GET /history/:player_id)
    resp = s.get("/history/" + playerID)
    s.Equal(200, resp.StatusCode)
    s.Equal(5, extractTotalRecords(resp))
    
    // 5. Claim reward if eligible
    if totalPoints >= 500 {
        resp = s.postJSON("/rewards/claim", map[string]any{
            "player_id":  playerID,
            "checkpoint": 500,
        })
        s.Equal(200, resp.StatusCode)
    }
    
    // 6. Verify global history includes our spins
    resp = s.get("/history/global?limit=10")
    s.Equal(200, resp.StatusCode)
}

func (s *E2ESuite) TestDailyLimitEnforcement() {
    // 1. Enter game
    // 2. Spin MAX_DAILY_SPINS times
    // 3. Spin again → expect 429
}

func TestE2E(t *testing.T) {
    suite.Run(t, new(E2ESuite))
}
```

**Status:** ⬜ Not Started

---

#### Task 8.10: Create Postman/HTTP Client Collection

**File:** `backend/tests/postman/spinhead_api.json`

```json
{
    "info": {
        "name": "SpinHead API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {
            "key": "base_url",
            "value": "http://localhost:3001"
        },
        {
            "key": "player_id",
            "value": ""
        }
    ],
    "item": [
        {
            "name": "Players",
            "item": [
                {
                    "name": "Enter Game",
                    "request": {
                        "method": "POST",
                        "url": "{{base_url}}/players/enter",
                        "body": {
                            "mode": "raw",
                            "raw": "{\"nickname\": \"TestPlayer\"}",
                            "options": {
                                "raw": {
                                    "language": "json"
                                }
                            }
                        }
                    }
                },
                {
                    "name": "Get Profile",
                    "request": {
                        "method": "GET",
                        "url": "{{base_url}}/players/{{player_id}}"
                    }
                }
            ]
        },
        {
            "name": "Game",
            "item": [
                {
                    "name": "Spin",
                    "request": {
                        "method": "POST",
                        "url": "{{base_url}}/game/spin",
                        "body": {
                            "mode": "raw",
                            "raw": "{\"player_id\": \"{{player_id}}\"}",
                            "options": {
                                "raw": {
                                    "language": "json"
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "Rewards",
            "item": [
                {
                    "name": "Claim Reward",
                    "request": {
                        "method": "POST",
                        "url": "{{base_url}}/rewards/claim",
                        "body": {
                            "mode": "raw",
                            "raw": "{\"player_id\": \"{{player_id}}\", \"checkpoint\": 500}",
                            "options": {
                                "raw": {
                                    "language": "json"
                                }
                            }
                        }
                    }
                },
                {
                    "name": "Get Claim History",
                    "request": {
                        "method": "GET",
                        "url": "{{base_url}}/rewards/{{player_id}}"
                    }
                }
            ]
        },
        {
            "name": "History",
            "item": [
                {
                    "name": "Global History",
                    "request": {
                        "method": "GET",
                        "url": "{{base_url}}/history/global?page=1&limit=10"
                    }
                },
                {
                    "name": "Personal History",
                    "request": {
                        "method": "GET",
                        "url": "{{base_url}}/history/{{player_id}}?page=1&limit=10"
                    }
                }
            ]
        }
    ]
}
```

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] E2E test covers full game flow
- [ ] Test coverage > 80% on domain layer
- [ ] Mock repositories available for isolated testing
- [ ] Test fixtures make setup easy
- [ ] Postman collection documents all endpoints
- [ ] CI/CD can run tests automatically

---

## File Structure After Phase 8

```
backend/tests/
├── fixtures/
│   └── fixtures.go
├── testdb/
│   └── setup.go
├── mocks/
│   ├── player_repo.go
│   ├── spinlog_repo.go
│   └── reward_repo.go
├── integration/
│   ├── player_test.go
│   ├── reward_test.go
│   └── spin_test.go
├── e2e/
│   └── full_flow_test.go
└── postman/
    └── spinhead_api.json
```

---

## Running Tests

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Run specific module tests
go test ./internal/modules/player/...

# Run integration tests only
go test ./tests/integration/...

# Run E2E tests only
go test ./tests/e2e/...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```
