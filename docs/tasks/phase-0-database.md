# Phase 0: Database & Migrations

**Difficulty:** ⭐ (Easiest)  
**Tasks:** 3  
**Dependencies:** None

---

## Objective

Set up database schema with migrations. Reset DB to clean state before development.

---

## Tasks

### Task 0.1: Create SQL Migration Files

**File:** `backend/migrations/`

Create migration files for all 4 tables:

```
migrations/
├── 000001_create_players_table.up.sql
├── 000001_create_players_table.down.sql
├── 000002_create_spin_logs_table.up.sql
├── 000002_create_spin_logs_table.down.sql
├── 000003_create_reward_config_table.up.sql
├── 000003_create_reward_config_table.down.sql
├── 000004_create_reward_transactions_table.up.sql
└── 000004_create_reward_transactions_table.down.sql
```

**Schema Requirements:**

#### players
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| nickname | VARCHAR(50) | UNIQUE, NOT NULL |
| total_points | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

#### spin_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| player_id | UUID | REFERENCES players(id), NOT NULL |
| points_gained | INTEGER | NOT NULL, CHECK > 0 |
| source | VARCHAR(20) | NOT NULL (GAME, BONUS, ADMIN) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

**Indexes:** `idx_spin_logs_player_id`, `idx_spin_logs_created_at`

#### reward_config
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| checkpoint_val | INTEGER | UNIQUE, NOT NULL |
| reward_name | VARCHAR(100) | NOT NULL |
| reward_description | TEXT | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

#### reward_transactions
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| player_id | UUID | REFERENCES players(id), NOT NULL |
| checkpoint_val | INTEGER | NOT NULL |
| claimed_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

**Constraints:** UNIQUE(player_id, checkpoint_val)

**Status:** ⬜ Not Started

---

### Task 0.2: Create Migration Runner

**File:** `backend/internal/infrastructure/database/migrator.go`

Implement migration runner using `golang-migrate`:

```go
type Migrator interface {
    Up() error
    Down() error
    Reset() error  // Down then Up
    Version() (uint, bool, error)
}
```

**Requirements:**
- Read migration path from config
- Support Up, Down, Reset commands
- Log migration status
- Handle errors gracefully

**Status:** ⬜ Not Started

---

### Task 0.3: Create Seed Data for reward_config

**File:** `backend/migrations/seed/reward_config.sql`

Insert default reward checkpoints (configurable via YAML):

```yaml
# configs/rewards.yaml
rewards:
  checkpoints:
    - checkpoint_val: 500
      reward_name: "Bronze Reward"
      reward_description: "Congratulations! You've earned 500 points."
    - checkpoint_val: 1500
      reward_name: "Silver Reward"
      reward_description: "Amazing! You've reached 1500 points."
    - checkpoint_val: 3000
      reward_name: "Gold Reward"
      reward_description: "Incredible! You've hit 3000 points."
    - checkpoint_val: 5000
      reward_name: "Platinum Reward"
      reward_description: "Outstanding! You've achieved 5000 points."
    - checkpoint_val: 10000
      reward_name: "Diamond Reward"
      reward_description: "Legendary! You've conquered 10000 points."
```

**Requirements:**
- Read from YAML config (not hardcoded)
- Upsert logic (ON CONFLICT DO UPDATE)
- Can be re-run safely

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] All 4 tables created with correct schema
- [ ] Migrations can be run up and down
- [ ] Reset command drops and recreates all tables
- [ ] Seed data loads from YAML config
- [ ] No hardcoded values in migration files (use placeholders where needed)

---

## Commands

```bash
# Run migrations up
go run cmd/migrate/main.go up

# Run migrations down
go run cmd/migrate/main.go down

# Reset database
go run cmd/migrate/main.go reset

# Seed reward config
go run cmd/migrate/main.go seed
```
