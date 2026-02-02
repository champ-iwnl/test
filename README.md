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

## Frontend Setup

### Environment Configuration

Frontend uses different environment files for different deployment modes:

#### Production (Docker)
- **File**: `frontend/.env.local`
- **Usage**: Production build with Docker
- **API URL**: `http://backend:3001` (internal Docker network)

#### Development (Docker)
- **File**: `frontend/.env.development`
- **Usage**: Development mode with hot reload
- **API URL**: `http://localhost:3001` (host machine)
- **Port**: `3001` (to avoid conflict with production)

#### Local Development
- **File**: `frontend/.env.local`
- **Usage**: Local development with `npm run dev`
- **API URL**: `http://localhost:3001`

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_COUNT=3
NEXT_PUBLIC_API_RETRY_DELAY=1000

# App Settings
NEXT_PUBLIC_APP_NAME="Spin Game"
NEXT_PUBLIC_APP_DESCRIPTION="หมุนวงล้อลุ้นรางวัล"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Home Page Settings
NEXT_PUBLIC_HISTORY_PAGE_SIZE=10
NEXT_PUBLIC_PREFETCH_SIZE=5
```

### Running Frontend

#### Production Build
```bash
docker-compose up frontend
# Access at http://localhost:3000
```

#### Development with Hot Reload
```bash
docker-compose up frontend-dev
# Access at http://localhost:3001
```

#### Local Development
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:3000
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
