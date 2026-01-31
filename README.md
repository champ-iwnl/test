# Spin Head - Fullstack Application

**Architecture**: Full DDD + Clean Architecture  
**Frontend**: (TBD)  
**Backend**: Go + Fiber + GORM + PostgreSQL

## Project Structure

```
.
├── backend/                    # Go API Server
│   ├── cmd/                    # Application entrypoints
│   ├── internal/               # Private application code
│   │   ├── shared/             # Shared primitives
│   │   ├── infrastructure/     # Technical implementations
│   │   └── modules/            # Bounded contexts
│   ├── pkg/                    # Reusable libraries
│   ├── migrations/             # Database migrations
│   ├── go.mod, go.sum          # Dependencies
│   └── .env                    # Configuration
│
├── frontend/                   # React/Vue/Next.js (TBD)
│
└── docs/                       # Shared documentation
```

## Backend Setup

### Prerequisites
- Go 1.21+
- PostgreSQL 14+
- Fiber v2.52

### Quick Start

```bash
cd backend

# Load .env
cp .env.example .env

# Install dependencies
go mod download

# Run the API server
go run ./cmd/api/main.go
```

Server will run on `http://localhost:3001`

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=spinhead
DB_SSLMODE=disable

# Server
SERVER_PORT=3001
SERVER_ENV=development
LOG_LEVEL=info
```

### Build

```bash
cd backend
go build -o bin/api.exe ./cmd/api
./bin/api.exe
```

### Health Checks

```bash
curl http://localhost:3001/health
curl http://localhost:3001/health/db
curl http://localhost:3001/api/info
```

## Architecture

See [docs/overview.md](docs/overview.md) for full DDD architecture documentation.

### Key Patterns

- **Domain-Driven Design** with bounded contexts
- **Clean Architecture** with strict layer boundaries
- **Repository Pattern** for data access
- **Domain Events** for inter-context communication
- **Value Objects** for type safety
- **Aggregates** for consistency boundaries

## Testing

```bash
cd backend

# Run tests
go test ./...

# With coverage
go test -cover ./...
```

## Documentation

- [Architecture Overview](docs/overview.md) - Full DDD patterns (1,300+ lines)
- [Project Structure](backend/PROJECT_STRUCTURE.md) - Directory layout and responsibilities
- [Phase 1 Setup](backend/PHASE_1_SETUP.md) - Initial infrastructure completion

---

**Status**: Phase 1 Complete ✅  
**Next**: Phase 2 - Domain Model Implementation 🚀
