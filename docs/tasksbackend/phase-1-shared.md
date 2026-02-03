# Phase 1: Shared Layer

**Difficulty:** ⭐⭐  
**Tasks:** 6  
**Dependencies:** Phase 0

---

## Objective

Create shared primitives, constants, and utilities used across all bounded contexts.

---

## Tasks

### Task 1.1: Create Constants Package

**Files:**
```
backend/internal/shared/constants/
├── http_status.go
├── error_codes.go
├── spin_source.go
├── db_tables.go
└── pagination.go
```

#### http_status.go
```go
package constants

// HTTP Status Codes (avoid magic numbers)
const (
    StatusOK                  = 200
    StatusCreated             = 201
    StatusBadRequest          = 400
    StatusNotFound            = 404
    StatusConflict            = 409
    StatusTooManyRequests     = 429
    StatusInternalServerError = 500
)
```

#### error_codes.go
```go
package constants

// Business Error Codes
const (
    ErrCodePlayerNotFound      = "PLAYER_NOT_FOUND"
    ErrCodeInsufficientPoints  = "INSUFFICIENT_POINTS"
    ErrCodeAlreadyClaimed      = "ALREADY_CLAIMED"
    ErrCodeDailyLimitExceeded  = "DAILY_LIMIT_EXCEEDED"
    ErrCodeInvalidCheckpoint   = "INVALID_CHECKPOINT"
    ErrCodeValidationFailed    = "VALIDATION_FAILED"
)
```

#### spin_source.go
```go
package constants

// SpinSource represents origin of points
type SpinSource string

const (
    SpinSourceGame  SpinSource = "GAME"
    SpinSourceBonus SpinSource = "BONUS"
    SpinSourceAdmin SpinSource = "ADMIN"
)

func (s SpinSource) IsValid() bool {
    switch s {
    case SpinSourceGame, SpinSourceBonus, SpinSourceAdmin:
        return true
    }
    return false
}
```

#### db_tables.go
```go
package constants

// Table names (single source of truth)
const (
    TablePlayers             = "players"
    TableSpinLogs            = "spin_logs"
    TableRewardConfig        = "reward_config"
    TableRewardTransactions  = "reward_transactions"
)
```

#### pagination.go
```go
package constants

// Pagination defaults (can be overridden by config)
const (
    DefaultLimit = 20
    MaxLimit     = 100
    DefaultOffset = 0
)
```

**Status:** ⬜ Not Started

---

### Task 1.2: Create Shared Value Objects

**File:** `backend/internal/shared/domain/value_objects.go`

```go
package domain

// PlayerID wraps UUID for type safety
type PlayerID struct {
    value string
}

func NewPlayerID(id string) (*PlayerID, error)
func (p *PlayerID) String() string
func (p *PlayerID) Equals(other *PlayerID) bool
func (p *PlayerID) IsZero() bool

// Points wraps integer with business rules
type Points struct {
    amount int
}

func NewPoints(amount int) (*Points, error)  // Error if negative
func (p *Points) Add(other *Points) (*Points, error)
func (p *Points) Subtract(other *Points) (*Points, error)
func (p *Points) Value() int
func (p *Points) IsGreaterThanOrEqual(other *Points) bool
```

**Requirements:**
- Immutable (return new instances)
- Validation in constructors
- Type safety (can't mix PlayerID with RewardID)

**Status:** ⬜ Not Started

---

### Task 1.3: Create Domain Event Interface

**File:** `backend/internal/shared/domain/domain_event.go`

```go
package domain

import "time"

// DomainEvent is the marker interface for all domain events
type DomainEvent interface {
    EventType() string
    OccurredAt() time.Time
    AggregateID() string
}

// BaseEvent provides common fields
type BaseEvent struct {
    aggregateID string
    occurredAt  time.Time
}

func NewBaseEvent(aggregateID string) BaseEvent
func (e BaseEvent) OccurredAt() time.Time
func (e BaseEvent) AggregateID() string
```

**Status:** ⬜ Not Started

---

### Task 1.4: Create Domain Errors

**File:** `backend/internal/shared/domain/errors.go`

```go
package domain

import "errors"

// Domain-level errors
var (
    ErrPlayerNotFound     = errors.New("player not found")
    ErrInsufficientPoints = errors.New("insufficient points")
    ErrAlreadyClaimed     = errors.New("reward already claimed")
    ErrDailyLimitExceeded = errors.New("daily spin limit exceeded")
    ErrInvalidCheckpoint  = errors.New("invalid checkpoint value")
    ErrInvalidNickname    = errors.New("invalid nickname")
    ErrNegativePoints     = errors.New("points cannot be negative")
)

// DomainError wraps errors with code
type DomainError struct {
    Code    string
    Message string
    Err     error
}

func (e *DomainError) Error() string
func (e *DomainError) Unwrap() error

func NewDomainError(code string, message string, err error) *DomainError
```

**Status:** ⬜ Not Started

---

### Task 1.5: Create Pagination Types

**File:** `backend/internal/shared/domain/pagination.go`

```go
package domain

// PaginationParams holds pagination input
type PaginationParams struct {
    Limit  int
    Offset int
}

func NewPaginationParams(limit, offset int, cfg PaginationConfig) PaginationParams

// PaginatedResult holds paginated response
type PaginatedResult[T any] struct {
    Data   []T   `json:"data"`
    Total  int64 `json:"total"`
    Limit  int   `json:"limit"`
    Offset int   `json:"offset"`
}

func NewPaginatedResult[T any](data []T, total int64, params PaginationParams) PaginatedResult[T]
```

**Requirements:**
- Generic type for reusability
- Validate limit against MaxLimit from config
- Default values from config

**Status:** ⬜ Not Started

---

### Task 1.6: Create HTTP Response Wrapper

**File:** `backend/internal/shared/http/response.go`

```go
package http

import "github.com/gofiber/fiber/v2"

// Response is the standard API response format
type Response struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data,omitempty"`
    Error   *ErrorBody  `json:"error,omitempty"`
}

type ErrorBody struct {
    Code    string `json:"code"`
    Message string `json:"message"`
}

// Helper functions
func Success(c *fiber.Ctx, status int, data interface{}) error
func Created(c *fiber.Ctx, data interface{}) error
func Error(c *fiber.Ctx, status int, code string, message string) error
func BadRequest(c *fiber.Ctx, code string, message string) error
func NotFound(c *fiber.Ctx, code string, message string) error
func Conflict(c *fiber.Ctx, code string, message string) error
func TooManyRequests(c *fiber.Ctx, code string, message string) error
func InternalError(c *fiber.Ctx, message string) error
```

**Requirements:**
- Consistent JSON structure
- Use constants for status codes
- Use constants for error codes

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] All constants defined in single location
- [ ] Value objects are immutable
- [ ] Domain errors have codes and messages
- [ ] Pagination is generic and configurable
- [ ] HTTP responses follow consistent format
- [ ] No hardcoded values (use constants)

---

## File Structure After Phase 1

```
backend/internal/shared/
├── constants/
│   ├── http_status.go
│   ├── error_codes.go
│   ├── spin_source.go
│   ├── db_tables.go
│   └── pagination.go
├── domain/
│   ├── value_objects.go
│   ├── domain_event.go
│   ├── errors.go
│   └── pagination.go
└── http/
    └── response.go
```
