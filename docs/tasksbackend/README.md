# 🎯 SPIN HEAD - Task Breakdown

## Overview

Complete implementation plan for Spin Head API following **Full DDD + Clean Architecture**.

**Total Tasks: ~83**  
**Phases: 10 (0-9)**  
**Stack: Go + Fiber + GORM + PostgreSQL + Viper**

---

## 📊 API Endpoints

| # | Endpoint | Method | Description | Phase |
|---|----------|--------|-------------|-------|
| 1 | `/players/enter` | POST | Enter/Resume player | 3 |
| 2 | `/players/:id` | GET | Get player profile | 3, 4, 6 |
| 3 | `/game/spin` | POST | Execute spin | 7 |
| 4 | `/rewards/claim` | POST | Claim reward | 6 |
| 5 | `/history/global` | GET | Global spin history | 5 |
| 6 | `/history/:player_id` | GET | Personal spin history | 5 |
| 7 | `/rewards/:player_id` | GET | Reward claim history | 6 |

---

## 📁 Phase Index

| Phase | Name | Tasks | Difficulty | Status |
|-------|------|-------|------------|--------|
| [0](./phase-0-database.md) | Database & Migrations | 3 | ⭐ | ⬜ |
| [1](./phase-1-shared.md) | Shared Layer | 6 | ⭐⭐ | ⬜ |
| [2](./phase-2-config.md) | Configuration System | 4 | ⭐⭐ | ⬜ |
| [3](./phase-3-player.md) | Player Module | 12 | ⭐⭐⭐ | ⬜ |
| [4](./phase-4-reward-config.md) | Reward Config Module | 6 | ⭐⭐⭐ | ⬜ |
| [5](./phase-5-history.md) | History Module | 10 | ⭐⭐⭐ | ⬜ |
| [6](./phase-6-reward.md) | Reward Module | 12 | ⭐⭐⭐⭐ | ⬜ |
| [7](./phase-7-game.md) | Game Module (Spin) | 15 | ⭐⭐⭐⭐⭐ | ⬜ |
| [8](./phase-8-testing.md) | Testing & Quality | 10 | ⭐⭐⭐⭐ | ⬜ |
| [9](./phase-9-polish.md) | Polish & Documentation | 5 | ⭐⭐ | ⬜ |

---

## 🗃️ Database Schema

```
┌─────────────────┐     ┌─────────────────┐
│    players      │     │   spin_logs     │
├─────────────────┤     ├─────────────────┤
│ id (UUID, PK)   │◄────│ player_id (FK)  │
│ nickname (UQ)   │     │ id (UUID, PK)   │
│ total_points    │     │ points_gained   │
│ created_at      │     │ source          │
│ updated_at      │     │ created_at      │
└─────────────────┘     └─────────────────┘
         │
         │
         ▼
┌────────────────────┐  ┌─────────────────────┐
│reward_transactions │  │   reward_config     │
├────────────────────┤  ├─────────────────────┤
│ id (UUID, PK)      │  │ id (PK)             │
│ player_id (FK)     │  │ checkpoint_val (UQ) │
│ checkpoint_val     │──│ reward_name         │
│ claimed_at         │  │ reward_description  │
└────────────────────┘  │ created_at          │
                        └─────────────────────┘
```

---

## 📈 Dependency Graph

```
PHASE 0 (DB Reset)
    │
    ▼
PHASE 1 (Shared) ──────────────────────────────┐
    │                                           │
    ▼                                           │
PHASE 2 (Config)                                │
    │                                           │
    ▼                                           │
PHASE 3 (Player) ◄──────────────────────────────┤
    │                                           │
    ├────────────────┐                          │
    ▼                ▼                          │
PHASE 4          PHASE 5                        │
(RewardCfg)      (History)                      │
    │                │                          │
    └───────┬────────┘                          │
            ▼                                   │
        PHASE 6 (Reward) ◄──────────────────────┤
            │                                   │
            ▼                                   │
        PHASE 7 (Game) ◄────────────────────────┘
            │
            ▼
        PHASE 8 (Testing)
            │
            ▼
        PHASE 9 (Polish)
```

---

## 🔑 Libraries

| Purpose | Library | Version |
|---------|---------|---------|
| Web Framework | `gofiber/fiber/v2` | v2.52+ |
| ORM | `gorm.io/gorm` | v1.25+ |
| Config | `spf13/viper` | v1.18+ |
| Validation | `go-playground/validator/v10` | v10+ |
| UUID | `google/uuid` | v1.5+ |
| Logging | `rs/zerolog` | v1.31+ |
| Migration | `golang-migrate/migrate/v4` | v4+ |
| Testing | `stretchr/testify` | v1.8+ |
| Env Loading | `joho/godotenv` | v1.5+ |

---

## 🚫 Rules

1. **NO HARDCODING** - All values must be configurable
2. **Constants for repeated values** - Use `constants/` package
3. **Config via Viper** - YAML files + environment variables
4. **Fiber middleware** - Use built-in middleware first
5. **Repository pattern** - Interface in domain, impl in adapter
6. **DTOs** - Never expose domain objects to HTTP layer

---

## ✅ Progress Tracker

- [ ] Phase 0: Database (0/3)
- [ ] Phase 1: Shared (0/6)
- [ ] Phase 2: Config (0/4)
- [ ] Phase 3: Player (0/12)
- [ ] Phase 4: Reward Config (0/6)
- [ ] Phase 5: History (0/10)
- [ ] Phase 6: Reward (0/12)
- [ ] Phase 7: Game (0/15)
- [ ] Phase 8: Testing (0/10)
- [ ] Phase 9: Polish (0/5)

**Total: 0/83 tasks completed**
