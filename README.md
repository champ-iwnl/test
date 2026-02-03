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

## 🧰 Installation (Local)

### Prerequisites
- Go 1.21+
- Node.js 18+
- Docker + Docker Compose
- PostgreSQL (local) or Azure PostgreSQL

### 1) Configure Environment
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

### 2) Run Backend (Docker)
```
docker compose up -d backend
```
API: http://localhost:8081

### 3) Run Frontend (Local)
```
cd frontend
npm install
npm run dev
```
Web: http://localhost:3000

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

## 🗂️ Database Design (ER Thinking)
ออกแบบ ER ก่อนเขียนโค้ดเพื่อกำหนดความสัมพันธ์และ business rules:
- `players` (1) — (N) `spin_logs`
- `reward_config` (1) — (N) `reward_transactions`
- `players` (1) — (N) `reward_transactions`

เหตุผล:
- `spin_logs` แยกจาก `players` เพื่อเก็บประวัติและวิเคราะห์สถิติ
- `reward_transactions` แยกจาก `reward_config` เพื่อบันทึกการรับรางวัลตามเวลา
- Index และ pagination รองรับ query ขนาดใหญ่

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
```
.
├── backend/                    # Go API Server
│   ├── cmd/
│   ├── internal/
│   ├── migrations/
│   └── pkg/
├── frontend/                   # Next.js app
└── docs/                       # Architecture and tasks
```
