# Phase 9: Polish & Documentation

**Difficulty:** ⭐⭐  
**Tasks:** 5  
**Dependencies:** All previous phases

---

## Objective

Final polish including validation, logging, documentation, and health checks.

---

## Tasks

### 9A. Request Validation

#### Task 9.1: Add Global Request Validation Middleware

**File:** `backend/internal/infrastructure/middleware/validation.go`

```go
package middleware

import (
    "github.com/gofiber/fiber/v2"
    "github.com/go-playground/validator/v10"
    httputil "backend/internal/shared/http"
    "backend/internal/shared/constants"
)

var validate *validator.Validate

func init() {
    validate = validator.New()
    
    // Register custom validations
    validate.RegisterValidation("spin_source", validateSpinSource)
}

// validateSpinSource validates spin source values
func validateSpinSource(fl validator.FieldLevel) bool {
    source := fl.Field().String()
    return source == constants.SpinSourceGame || source == constants.SpinSourceBonus
}

// ValidateStruct validates any struct using go-playground/validator
func ValidateStruct(s interface{}) error {
    return validate.Struct(s)
}

// ValidationErrorResponse formats validation errors for response
func ValidationErrorResponse(c *fiber.Ctx, err error) error {
    if validationErrors, ok := err.(validator.ValidationErrors); ok {
        errors := make([]map[string]string, 0, len(validationErrors))
        for _, e := range validationErrors {
            errors = append(errors, map[string]string{
                "field":   e.Field(),
                "tag":     e.Tag(),
                "message": formatValidationMessage(e),
            })
        }
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "code":    constants.ErrCodeValidationFailed,
            "message": "Validation failed",
            "errors":  errors,
        })
    }
    return httputil.BadRequest(c, constants.ErrCodeValidationFailed, err.Error())
}

func formatValidationMessage(e validator.FieldError) string {
    switch e.Tag() {
    case "required":
        return e.Field() + " is required"
    case "uuid":
        return e.Field() + " must be a valid UUID"
    case "min":
        return e.Field() + " must be at least " + e.Param()
    case "max":
        return e.Field() + " must be at most " + e.Param()
    default:
        return e.Field() + " failed " + e.Tag() + " validation"
    }
}
```

**Usage in handlers:**

```go
func (h *PlayerHandler) Enter(c *fiber.Ctx) error {
    var req dto.EnterRequest
    if err := c.BodyParser(&req); err != nil {
        return httputil.BadRequest(c, constants.ErrCodeValidationFailed, "Invalid request body")
    }
    
    if err := middleware.ValidateStruct(&req); err != nil {
        return middleware.ValidationErrorResponse(c, err)
    }
    
    // ... continue with usecase
}
```

**Status:** ⬜ Not Started

---

### 9B. Structured Logging

#### Task 9.2: Implement Structured Logging with Zerolog

**File:** `backend/internal/infrastructure/logger/logger.go`

```go
package logger

import (
    "os"
    "time"
    "github.com/rs/zerolog"
    "github.com/rs/zerolog/log"
    "backend/internal/infrastructure/config"
)

// Init initializes zerolog with configuration
func Init(cfg *config.LogConfig) {
    // Set log level
    level, err := zerolog.ParseLevel(cfg.Level)
    if err != nil {
        level = zerolog.InfoLevel
    }
    zerolog.SetGlobalLevel(level)
    
    // Configure output format
    if cfg.Format == "pretty" {
        log.Logger = log.Output(zerolog.ConsoleWriter{
            Out:        os.Stdout,
            TimeFormat: time.RFC3339,
        })
    } else {
        // JSON format for production
        zerolog.TimeFieldFormat = time.RFC3339
    }
    
    // Add default fields
    log.Logger = log.With().
        Str("service", "spinhead-api").
        Logger()
}

// WithContext returns logger with request context
func WithContext(requestID string) zerolog.Logger {
    return log.With().
        Str("request_id", requestID).
        Logger()
}
```

**File:** `backend/internal/infrastructure/middleware/logging.go`

```go
package middleware

import (
    "time"
    "github.com/gofiber/fiber/v2"
    "github.com/rs/zerolog/log"
    "github.com/google/uuid"
)

// RequestLogger logs HTTP requests
func RequestLogger() fiber.Handler {
    return func(c *fiber.Ctx) error {
        start := time.Now()
        requestID := uuid.New().String()
        
        // Set request ID in locals for handlers
        c.Locals("request_id", requestID)
        
        // Process request
        err := c.Next()
        
        // Log after response
        duration := time.Since(start)
        
        logEvent := log.Info().
            Str("request_id", requestID).
            Str("method", c.Method()).
            Str("path", c.Path()).
            Int("status", c.Response().StatusCode()).
            Dur("duration", duration).
            Str("ip", c.IP())
        
        if err != nil {
            logEvent = log.Error().
                Str("request_id", requestID).
                Err(err)
        }
        
        logEvent.Msg("HTTP Request")
        
        return err
    }
}
```

**Config YAML:** `backend/config/log.yaml`

```yaml
log:
  level: "info"      # debug, info, warn, error
  format: "json"     # json, pretty
```

**Status:** ⬜ Not Started

---

### 9C. API Documentation

#### Task 9.3: Add Swagger/OpenAPI Documentation

**File:** `backend/docs/swagger.yaml`

```yaml
openapi: 3.0.3
info:
  title: SpinHead API
  description: |
    SpinHead Game API - A wheel spinning game with points and rewards.
    
    ## Features
    - Player management (enter/resume)
    - Weighted random spin system
    - Checkpoint-based reward claiming
    - Comprehensive history tracking
  version: 1.0.0
  contact:
    name: SpinHead Team

servers:
  - url: http://localhost:3001
    description: Local development

tags:
  - name: Players
    description: Player management endpoints
  - name: Game
    description: Game mechanics (spin)
  - name: Rewards
    description: Reward claiming system
  - name: History
    description: Activity history

paths:
  /players/enter:
    post:
      tags: [Players]
      summary: Enter or resume game
      description: Creates new player or resumes existing session by nickname
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EnterRequest'
      responses:
        '200':
          description: Success (new or existing player)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PlayerResponse'
        '400':
          description: Invalid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /players/{id}:
    get:
      tags: [Players]
      summary: Get player profile
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Player profile with claimed checkpoints
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProfileResponse'
        '404':
          description: Player not found

  /game/spin:
    post:
      tags: [Game]
      summary: Execute a spin
      description: |
        Performs weighted random spin and adds points to player.
        Limited to configurable daily maximum spins.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SpinRequest'
      responses:
        '200':
          description: Spin successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SpinResponse'
        '404':
          description: Player not found
        '429':
          description: Daily spin limit exceeded

  /rewards/claim:
    post:
      tags: [Rewards]
      summary: Claim a checkpoint reward
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ClaimRequest'
      responses:
        '200':
          description: Reward claimed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClaimResponse'
        '400':
          description: Insufficient points
        '404':
          description: Player or checkpoint not found
        '409':
          description: Already claimed

  /rewards/{player_id}:
    get:
      tags: [Rewards]
      summary: Get reward claim history
      parameters:
        - name: player_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: List of claimed rewards
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClaimHistoryResponse'

  /history/global:
    get:
      tags: [History]
      summary: Get global spin history
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        '200':
          description: Paginated global history
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HistoryResponse'

  /history/{player_id}:
    get:
      tags: [History]
      summary: Get personal spin history
      parameters:
        - name: player_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        '200':
          description: Paginated personal history

components:
  parameters:
    PageParam:
      name: page
      in: query
      schema:
        type: integer
        minimum: 1
        default: 1
    LimitParam:
      name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 10

  schemas:
    EnterRequest:
      type: object
      required: [nickname]
      properties:
        nickname:
          type: string
          minLength: 1
          maxLength: 50
          example: "Player123"

    PlayerResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        nickname:
          type: string
        total_points:
          type: integer
        created_at:
          type: string
          format: date-time

    ProfileResponse:
      allOf:
        - $ref: '#/components/schemas/PlayerResponse'
        - type: object
          properties:
            claimed_checkpoints:
              type: array
              items:
                type: integer
              example: [500, 1000]

    SpinRequest:
      type: object
      required: [player_id]
      properties:
        player_id:
          type: string
          format: uuid

    SpinResponse:
      type: object
      properties:
        spin_id:
          type: string
          format: uuid
        points_gained:
          type: integer
          example: 500
        total_points_after:
          type: integer
          example: 1500

    ClaimRequest:
      type: object
      required: [player_id, checkpoint]
      properties:
        player_id:
          type: string
          format: uuid
        checkpoint:
          type: integer
          example: 1000

    ClaimResponse:
      type: object
      properties:
        transaction_id:
          type: string
          format: uuid
        checkpoint:
          type: integer
        reward_name:
          type: string
        reward_description:
          type: string
        claimed_at:
          type: string
          format: date-time

    ClaimHistoryResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/ClaimResponse'

    HistoryResponse:
      type: object
      properties:
        data:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
                format: uuid
              player_id:
                type: string
                format: uuid
              nickname:
                type: string
              points_gained:
                type: integer
              source:
                type: string
                enum: [GAME, BONUS]
              created_at:
                type: string
                format: date-time
        pagination:
          $ref: '#/components/schemas/Pagination'

    Pagination:
      type: object
      properties:
        current_page:
          type: integer
        per_page:
          type: integer
        total_pages:
          type: integer
        total_records:
          type: integer

    ErrorResponse:
      type: object
      properties:
        code:
          type: string
          example: "VALIDATION_FAILED"
        message:
          type: string
          example: "Invalid request body"
```

**Optional: Swagger UI Integration**

```go
// In main.go or routes.go
import "github.com/gofiber/swagger"

app.Get("/swagger/*", swagger.HandlerDefault)
```

**Status:** ⬜ Not Started

---

### 9D. Health & Monitoring

#### Task 9.4: Add Health Check Endpoints

**File:** `backend/internal/infrastructure/health/handler.go`

```go
package health

import (
    "context"
    "time"
    "github.com/gofiber/fiber/v2"
    "gorm.io/gorm"
)

type Handler struct {
    db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
    return &Handler{db: db}
}

// Liveness - is the service running?
func (h *Handler) Liveness(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{
        "status": "ok",
        "time":   time.Now().UTC(),
    })
}

// Readiness - is the service ready to accept traffic?
func (h *Handler) Readiness(c *fiber.Ctx) error {
    ctx, cancel := context.WithTimeout(c.Context(), 5*time.Second)
    defer cancel()
    
    // Check database connection
    sqlDB, err := h.db.DB()
    if err != nil {
        return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
            "status":   "unhealthy",
            "database": "error getting connection",
        })
    }
    
    if err := sqlDB.PingContext(ctx); err != nil {
        return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
            "status":   "unhealthy",
            "database": "ping failed",
        })
    }
    
    return c.JSON(fiber.Map{
        "status":   "ok",
        "database": "connected",
        "time":     time.Now().UTC(),
    })
}

// RegisterRoutes registers health endpoints
func (h *Handler) RegisterRoutes(app *fiber.App) {
    health := app.Group("/health")
    
    health.Get("/live", h.Liveness)
    health.Get("/ready", h.Readiness)
}
```

**Status:** ⬜ Not Started

---

### 9E. Project README

#### Task 9.5: Create Comprehensive README

**File:** `backend/README.md`

```markdown
# 🎰 SpinHead API

A wheel-spinning game API built with **Go**, **Fiber**, **GORM**, and **PostgreSQL**.

## 🚀 Quick Start

### Prerequisites

- Go 1.21+
- PostgreSQL 14+
- Make (optional)

### Setup

1. Clone and navigate:
   ```bash
   cd backend
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Configure `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_DATABASE=spinhead
   DB_SSL_MODE=disable
   
   SERVER_PORT=3001
   ```

4. Run migrations:
   ```bash
   go run cmd/migrate/main.go up
   ```

5. Start server:
   ```bash
   go run cmd/api/main.go
   ```

## 📖 API Documentation

- Swagger UI: http://localhost:3001/swagger/
- OpenAPI Spec: `docs/swagger.yaml`

## 🎯 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/players/enter` | Enter/resume game |
| GET | `/players/:id` | Get player profile |
| POST | `/game/spin` | Execute spin |
| POST | `/rewards/claim` | Claim reward |
| GET | `/rewards/:player_id` | Claim history |
| GET | `/history/global` | Global history |
| GET | `/history/:player_id` | Personal history |
| GET | `/health/live` | Liveness check |
| GET | `/health/ready` | Readiness check |

## ⚙️ Configuration

All game values are configurable via YAML files in `config/`:

### `game.yaml`
```yaml
game:
  spin:
    max_daily_spins: 10
    distribution:
      - points: 300
        weight: 40
      - points: 500
        weight: 35
      - points: 1000
        weight: 20
      - points: 3000
        weight: 5
```

### `rewards.yaml`
```yaml
rewards:
  checkpoints:
    - checkpoint: 500
      name: "Bronze Reward"
      description: "First milestone!"
    - checkpoint: 1000
      name: "Silver Reward"
      description: "Keep spinning!"
    # ... more checkpoints
```

## 🧪 Testing

```bash
# Run all tests
go test ./...

# With coverage
go test -cover ./...

# Integration tests only
go test ./tests/integration/...
```

## 📁 Project Structure

```
backend/
├── cmd/
│   ├── api/main.go       # API entrypoint
│   └── migrate/main.go   # Migration CLI
├── config/               # YAML config files
├── internal/
│   ├── infrastructure/   # DB, config, middleware
│   ├── modules/          # DDD bounded contexts
│   │   ├── player/
│   │   ├── game/
│   │   ├── history/
│   │   └── reward/
│   └── shared/           # Shared domain/utils
├── migrations/           # SQL migrations
└── tests/                # Test suites
```

## 🏗️ Architecture

This project follows **Domain-Driven Design (DDD)** with **Clean Architecture**:

- **Domain Layer**: Entities, Value Objects, Domain Services
- **Application Layer**: Use Cases, DTOs
- **Adapter Layer**: HTTP Handlers, Repository Implementations
- **Infrastructure Layer**: Database, Config, External Services

## 📜 License

MIT
```

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] Request validation with clear error messages
- [ ] Structured JSON logging in production
- [ ] Pretty logging in development
- [ ] Swagger documentation accessible
- [ ] Health endpoints respond correctly
- [ ] README covers all setup steps
- [ ] All config values documented

---

## File Structure After Phase 9

```
backend/
├── README.md
├── docs/
│   └── swagger.yaml
├── internal/
│   └── infrastructure/
│       ├── logger/
│       │   └── logger.go
│       ├── middleware/
│       │   ├── logging.go
│       │   └── validation.go
│       └── health/
│           └── handler.go
└── config/
    └── log.yaml
```

---

## 🎉 Project Complete!

After Phase 9, the SpinHead API is:

✅ **Fully Functional** - All 7 endpoints working  
✅ **Configurable** - No hardcoded values  
✅ **Tested** - Unit, integration, and E2E tests  
✅ **Documented** - Swagger + README  
✅ **Production Ready** - Logging, health checks, validation
