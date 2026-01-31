# Project Structure Documentation

> Generated from Full DDD Architecture in overview.md

## Directory Tree

```
spinhead/
├── cmd/                          # Application Entrypoints
│   ├── api/
│   │   └── main.go              # HTTP API server
│   └── worker/
│       └── main.go              # Event processor/worker
│
├── internal/                     # Private application code
│   ├── shared/                   # Cross-context shared primitives
│   │   ├── domain/
│   │   │   ├── value_objects.go # Shared ValueObject base, ID types
│   │   │   ├── domain_event.go  # DomainEvent interface
│   │   │   └── errors.go        # Base domain errors
│   │   ├── application/
│   │   │   └── errors.go        # Base app errors, DTOs
│   │   └── http/
│   │       └── status.go        # HTTP status codes
│   │
│   ├── infrastructure/           # Technical implementation
│   │   ├── config/
│   │   │   └── config.go        # Viper configuration
│   │   ├── database/
│   │   │   ├── connection.go    # GORM database connection
│   │   │   └── migrations/      # SQL migration files
│   │   ├── logger/
│   │   │   └── logger.go        # Structured logging
│   │   ├── event_bus/           # Event publishing
│   │   │   ├── publisher.go
│   │   │   └── subscriber.go
│   │   └── external/            # Third-party service clients
│   │       ├── payment/
│   │       └── notification/
│   │
│   └── modules/                 # Bounded Contexts (Business Domains)
│       ├── player/              # Player Management Context
│       │   ├── domain/          # Business logic & rules
│       │   │   ├── aggregate_root.go    # Player aggregate
│       │   │   ├── value_objects.go     # PlayerID, Nickname, Points
│       │   │   ├── repository.go        # Repository interface
│       │   │   ├── service.go           # Domain services
│       │   │   ├── specification.go     # Query specifications
│       │   │   ├── factory.go           # Factory pattern
│       │   │   └── events.go            # Domain events
│       │   │
│       │   ├── application/     # Use cases & orchestration
│       │   │   ├── enter/
│       │   │   │   ├── enter.go         # Player enter usecase
│       │   │   │   └── dto.go
│       │   │   ├── get_profile/
│       │   │   │   ├── profile.go
│       │   │   │   └── dto.go
│       │   │   └── add_points/
│       │   │       ├── add_points.go
│       │   │       └── dto.go
│       │   │
│       │   ├── adapter/         # External boundaries
│       │   │   ├── repository/
│       │   │   │   └── player_repository_gorm.go  # GORM impl
│       │   │   ├── handler/
│       │   │   │   ├── player_handler.go
│       │   │   │   └── http.go                    # Routes & DI
│       │   │   └── event_listener/
│       │   │       └── player_event_listener.go
│       │   │
│       │   └── module.go        # DI container
│       │
│       ├── game/                # Game Management Context
│       │   ├── domain/          # Game business logic
│       │   │   ├── game.go
│       │   │   ├── value_objects.go
│       │   │   ├── repository.go
│       │   │   ├── factory.go
│       │   │   └── events.go
│       │   ├── application/
│       │   ├── adapter/
│       │   └── module.go
│       │
│       ├── reward/              # Reward Management Context
│       │   ├── domain/          # Reward business logic
│       │   │   ├── reward.go
│       │   │   ├── value_objects.go
│       │   │   ├── repository.go
│       │   │   ├── factory.go
│       │   │   └── events.go
│       │   ├── application/
│       │   ├── adapter/
│       │   └── module.go
│       │
│       └── history/             # History/Audit Context
│           ├── domain/
│           ├── application/
│           ├── adapter/
│           └── module.go
│
├── pkg/                         # Reusable libraries (no framework deps)
│   ├── errors/                  # Custom error types
│   ├── validator/               # Validation logic
│   ├── logger/                  # Logging utilities
│   └── uuid/                    # UUID generation
│
├── configs/                     # Configuration files
│   ├── app.yaml
│   ├── database.yaml
│   └── event.yaml
│
├── migrations/                  # Database migrations
│   ├── 001_create_players.sql
│   ├── 002_create_games.sql
│   └── 003_create_rewards.sql
│
├── deploy/                      # Deployment configs
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── k8s/
│
├── tests/                       # Test suites
│   ├── integration/             # Integration tests
│   ├── e2e/                     # End-to-end tests
│   └── fixtures/                # Test data & fixtures
│
├── docs/                        # Documentation
│   ├── overview.md              # Architecture overview
│   ├── bounded_contexts.md      # Bounded context details
│   ├── ubiquitous_language.md   # Domain language glossary
│   ├── api_spec.md              # API specification
│   ├── erd.md                   # Entity relationship diagram
│   └── sequence_diagrams/       # Sequence diagrams
│
├── .env                         # Environment variables
├── go.mod                       # Go module definition
├── go.sum                       # Dependency lock file
├── Makefile                     # Build commands
└── .gitignore                   # Git ignore rules
```

## Layering & Dependencies

### Domain Layer (`internal/modules/*/domain/`)
- **Pure business logic**, zero external dependencies
- No imports from GORM, HTTP, config, external services
- Can be tested in isolation with zero infrastructure
- Contains: Aggregates, Value Objects, Services, Events, Interfaces

### Application Layer (`internal/modules/*/application/`)
- **Orchestration & transaction boundaries**
- Can import domain layer only
- Cannot import infrastructure directly
- Contains: Use Cases, DTOs, Event Publishers

### Adapter Layer (`internal/modules/*/adapter/`)
- **Boundary translation & external communication**
- Can import domain and application layers
- Implements domain repository interfaces using GORM
- Implements external service interfaces
- Contains: HTTP Handlers, Repository Implementations, DTOs Mappers

### Infrastructure Layer (`internal/infrastructure/`)
- **Technical implementations**
- Database connections, config, logging, external APIs
- Implements interfaces defined in domain/application
- Can be swapped without changing domain logic

### Shared & Cross-Cutting (`internal/shared/`)
- Base errors, utilities, shared domain primitives
- Used by all bounded contexts
- No context-specific logic

### Reusable Libraries (`pkg/`)
- Framework-independent utilities
- Can be reused across projects
- Examples: errors, validators, loggers

## Bounded Contexts

### Player Context (`internal/modules/player/`)
**Responsibilities:**
- Player lifecycle management
- Profile management
- Points tracking
- Status management (active, suspended, banned)

**Events Produced:**
- PlayerCreated
- PlayerEntered
- PointsAdded
- PlayerSuspended

### Game Context (`internal/modules/game/`)
**Responsibilities:**
- Game session management
- Spin wheel execution
- Result tracking
- Prize determination

**Events Produced:**
- GameStarted
- SpinExecuted
- ResultAnnounced

### Reward Context (`internal/modules/reward/`)
**Responsibilities:**
- Reward catalog management
- Reward distribution
- Claim processing
- Redemption tracking

**Events Produced:**
- RewardGranted
- RewardClaimed
- RewardRedeemed

### History Context (`internal/modules/history/`)
**Responsibilities:**
- Audit trail
- Event logging
- Analytics data storage
- User activity tracking

**Events Produced:**
- EventRecorded
- AuditLogCreated

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| `cmd/api/main.go` | HTTP server entry point |
| `cmd/worker/main.go` | Event processor entry point |
| `internal/infrastructure/config/config.go` | Configuration loading via Viper |
| `internal/infrastructure/database/connection.go` | GORM database initialization |
| `internal/shared/domain/domain_event.go` | Event interface definition |
| `internal/shared/http/status.go` | HTTP status code constants |
| `internal/modules/*/domain/aggregate_root.go` | Business logic & invariants |
| `internal/modules/*/application/*/use_case.go` | Transaction orchestration |
| `internal/modules/*/adapter/repository/*.go` | GORM persistence |
| `internal/modules/*/adapter/handler/*.go` | HTTP request handling |

## Implementation Flow

1. **HTTP Request** → Handler (`adapter/handler/`)
2. **Parse & Validate** → HTTP layer
3. **Delegate** → Use Case (`application/`)
4. **Load Aggregate** → Repository (domain interface)
5. **Execute Domain Logic** → Aggregate Root (`domain/`)
6. **Collect Events** → Domain Events
7. **Persist** → Repository Implementation
8. **Publish Events** → Event Bus
9. **Return Response** → Handler formats response

## Database Migrations

Migrations stored in `migrations/` directory:
- `001_create_players.sql` - Player table schema
- `002_create_games.sql` - Game table schema
- `003_create_rewards.sql` - Reward table schema

Each migration is versioned and idempotent.

## Testing Strategy

- **Unit Tests**: Domain logic (`tests/unit/`) - no infrastructure
- **Integration Tests**: Use cases + repository (`tests/integration/`)
- **E2E Tests**: Full stack HTTP handlers (`tests/e2e/`)
- **Fixtures**: Test data (`tests/fixtures/`)

## Configuration

Environment variables loaded via Viper from `.env`:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` - PostgreSQL
- `SERVER_PORT`, `SERVER_ENV` - Server config
- `LOG_LEVEL` - Logging level

Config files in `configs/`:
- `app.yaml` - Application settings
- `database.yaml` - Database configuration
- `event.yaml` - Event bus configuration

---

**Architecture**: Full DDD + Clean Architecture  
**Stack**: Go + Fiber + GORM + PostgreSQL + Docker  
**Last Updated**: 2026-01-31
