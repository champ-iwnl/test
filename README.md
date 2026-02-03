# 🎯 Spin Head - Fullstack Application

**Architecture**: DDD + Clean Architecture  
**Frontend**: Next.js 16 (App Router) + Tailwind  
**Backend**: Go (Fiber) + PostgreSQL

## ✨ Features
- Player enter/profile
- Spin game with points
- Claim rewards at checkpoints
- Global history / Personal history / Reward history
- Infinite scroll history

## 🧰 Installation

### Prerequisites
- Node.js 18+
- **For Local Development**: Go 1.21+, PostgreSQL (local or Azure)
- **For Docker Development**: Docker + Docker Compose

### Option 1: Local Development (Recommended for development)

#### 1) Configure Environment
Single `.env` at repo root (shared by frontend + backend). Example keys:

```
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_API_TIMEOUT=10000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=spinhead
DB_SSLMODE=disable

SERVER_PORT=3001
SERVER_ENV=development
LOG_LEVEL=info
```

#### 2) Setup Database
- Install PostgreSQL locally, or use Azure PostgreSQL
- Run migrations: `make backend-migrate-up`
- Seed data: `make backend-seed`

#### 3) Run Backend (with Air hot reload)
```
cd backend
go install github.com/cosmtrek/air@latest
air
```
API: http://localhost:8081

#### 4) Run Frontend
```
cd frontend
npm install
npm run dev
```
Web: http://localhost:3000

### Option 2: Docker Development

#### 1) Configure Environment
Same `.env` file as above, but adjust URLs if needed.

#### 2) Run Everything with Docker
```
docker-compose up -d
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8081

#### 3) Run Migrations (if needed)
```
make backend-migrate-up-docker
make backend-seed-docker
```

## 🧱 Architecture Overview
Full DDD & Clean Architecture details: [docs/overview.md](docs/overview.md)

**Layers**
- **Presentation**: HTTP handlers (Fiber)
- **Application**: use-cases, DTOs, orchestration
- **Domain**: entities, aggregates, value objects, domain services
- **Infrastructure**: DB, logger, external services

**Key patterns**
- Bounded contexts (player, history, reward, game)
- Application / Domain / Infrastructure separation
- Repository + Domain Events
- Value Objects for consistency

## 📋 Backend Development Phases

Complete implementation following **Full DDD + Clean Architecture** with **~83 tasks** across 10 phases.

### 📊 API Endpoints
| # | Endpoint | Method | Description |
|---|----------|--------|-------------|
| 1 | `/players/enter` | POST | Enter/Resume player |
| 2 | `/players/:id` | GET | Get player profile |
| 3 | `/game/spin` | POST | Execute spin |
| 4 | `/rewards/claim` | POST | Claim reward |
| 5 | `/history/global` | GET | Global spin history |
| 6 | `/history/:player_id` | GET | Personal spin history |
| 7 | `/rewards/:player_id` | GET | Reward claim history |

### 📁 Phase Overview
| Phase | Name | Tasks | Description |
|-------|------|-------|-------------|
| [0](./docs/tasksbackend/phase-0-database.md) | Database & Migrations | 3 | DB setup, migrations, seed |
| [1](./docs/tasksbackend/phase-1-shared.md) | Shared Layer | 6 | Common types, errors, utils |
| [2](./docs/tasksbackend/phase-2-config.md) | Configuration System | 4 | Viper config, validation |
| [3](./docs/tasksbackend/phase-3-player.md) | Player Module | 12 | Player CRUD, profile |
| [4](./docs/tasksbackend/phase-4-reward-config.md) | Reward Config Module | 6 | Reward checkpoints setup |
| [5](./docs/tasksbackend/phase-5-history.md) | History Module | 10 | Global/personal history |
| [6](./docs/tasksbackend/phase-6-reward.md) | Reward Module | 12 | Claim rewards logic |
| [7](./docs/tasksbackend/phase-7-game.md) | Game Module (Spin) | 15 | Core spin mechanics |
| [8](./docs/tasksbackend/phase-8-testing.md) | Testing & Quality | 10 | Unit/integration tests |
| [9](./docs/tasksbackend/phase-9-polish.md) | Polish & Documentation | 5 | Final cleanup, docs |

Full task breakdown: [docs/tasksbackend/README.md](docs/tasksbackend/README.md)

## 🗂️ Database Design (ER Thinking)
ออกแบบ ER ก่อนเขียนโค้ดเพื่อกำหนดความสัมพันธ์และ business rules:
- `players` (1) — (N) `spin_logs`
- `reward_config` (1) — (N) `reward_transactions`
- `players` (1) — (N) `reward_transactions`

เหตุผล:
- `spin_logs` แยกจาก `players` เพื่อเก็บประวัติและวิเคราะห์สถิติ
- `reward_transactions` แยกจาก `reward_config` เพื่อบันทึกการรับรางวัลตามเวลา
- Index และ pagination รองรับ query ขนาดใหญ่

### 📊 API Sequence Diagrams
Visual flow diagrams for all endpoints: [docs/sequencediagram/](docs/sequencediagram/)
- [01_enter_resume](docs/sequencediagram/sequence_md/01_enter_resume.md) - Player enter/resume flow
- [02_get_player_profile](docs/sequencediagram/sequence_md/02_get_player_profile.md) - Get player profile
- [03_spin_game](docs/sequencediagram/sequence_md/03_spin_game.md) - Spin game mechanics
- [04_claim_reward](docs/sequencediagram/sequence_md/04_claim_reward.md) - Reward claiming
- [05_global_spin_history](docs/sequencediagram/sequence_md/05_global_spin_history.md) - Global history
- [06_personal_spin_history](docs/sequencediagram/sequence_md/06_personal_spin_history.md) - Personal history
- [07_reward_claim_history](docs/sequencediagram/sequence_md/07_reward_claim_history.md) - Reward history

## 🚀 Deployment (Pull Docker + Azure PostgreSQL)

### แนวคิด
- Build & push images จาก local
- VM ดึง image มา run ด้วย docker-compose
- ใช้ Azure PostgreSQL เป็น external DB

### ขั้นตอน
1) Build & push images
```
./build-and-push.sh
```

2) ตั้งค่า `.env` บน VM (ใช้ Azure DB)
```
DB_HOST=<azure-postgres-host>
DB_PORT=5432
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=<db>
DB_SSLMODE=require

NEXT_PUBLIC_API_URL=http://<VM_PUBLIC_IP>:8080
```

3) Pull + run บน VM
```
docker compose -f docker-compose.prod.yml up -d
```

### URLs
- Frontend: http://<VM_PUBLIC_IP>:3000
- Backend API: http://<VM_PUBLIC_IP>:8080
- Swagger: http://<VM_PUBLIC_IP>:8080/swagger/index.html

## ✅ Testing
```
cd backend
go test ./...
```

## 🗃️ Database Management

### Local Development (Direct Go)
```bash
# Reset database (drop all + migrate up + seed)
make backend-reset

# Run migrations up
make backend-migrate-up

# Seed initial data
make backend-seed

# Check migration version
cd backend && go run cmd/migrate/main.go version
```

### Production/Docker (Recommended)
```bash
# Reset database (drop all + migrate up + seed)
make backend-reset-docker

# Run migrations up
make backend-migrate-up-docker

# Seed initial data
make backend-seed-docker

# Or run directly with docker-compose
docker-compose exec backend go run cmd/migrate/main.go reset
```

### Manual Seeding (CSV)
```bash
# ใช้สำหรับ seed ข้อมูลจำนวนมากจาก CSV
./seed.sh
```

## 🧩 Project Structure

### Backend (Go + Fiber + PostgreSQL)
```
backend/
├── cmd/                        # Application entrypoints
│   ├── api/                    # Main API server
│   └── migrate/                # Database migration tool
├── configs/                    # Configuration files (YAML)
│   ├── game.yaml              # Game settings
│   ├── pagination.yaml        # Pagination config
│   ├── rewards.yaml           # Reward checkpoints
│   └── validation.yaml        # Validation rules
├── internal/                   # Private application code
│   ├── adapter/               # External service adapters
│   │   └── http/              # HTTP handlers
│   ├── infrastructure/        # Infrastructure layer
│   │   ├── config/            # Configuration management
│   │   ├── database/          # DB connection & migrations
│   │   ├── event_bus/         # Event handling
│   │   ├── external/          # External API clients
│   │   └── logger/            # Logging system
│   ├── modules/               # Business modules (DDD)
│   │   ├── game/              # Spin game logic
│   │   ├── history/           # History queries
│   │   ├── player/            # Player management
│   │   └── reward/            # Reward system
│   └── shared/                # Shared utilities
├── migrations/                # Database migrations
│   ├── *.up.sql              # Migration up scripts
│   ├── *.down.sql            # Migration down scripts
│   └── seed/                 # Seed data
├── pkg/                       # Public packages
```

### Frontend (Next.js + TypeScript + Tailwind)
```
frontend/
├── public/                    # Static assets
│   ├── config/               # Public config files
│   └── images/               # Image assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable UI components
│   ├── config/               # Frontend configuration
│   ├── features/             # Feature-specific code
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   ├── services/             # API service clients
│   ├── store/                # State management
│   ├── styles/               # Additional styles
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Helper functions
└── *.config.*                # Build configurations
```

### Documentation & Deployment
```
docs/                          # Project documentation
├── overview.md               # Architecture overview
├── tasksbackend/             # Backend development tasks
├── tasksfrontend/            # Frontend development tasks
├── sequencediagram/          # API sequence diagrams
└── STRUCTURE_COMPLETE.md     # Project structure guide

docker-compose.yml            # Development environment
docker-compose.prod.yml       # Production deployment
build-and-push.sh            # Docker build script
Makefile                      # Development commands
```
