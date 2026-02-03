# Phase 2: Configuration System

**Difficulty:** ⭐⭐  
**Tasks:** 4  
**Dependencies:** Phase 0, Phase 1

---

## Objective

Create comprehensive configuration system using Viper for all configurable values (game settings, pagination, rewards).

---

## Tasks

### Task 2.1: Create Game Configuration YAML

**File:** `backend/configs/game.yaml`

```yaml
# Game Configuration
# All game-related settings are configurable here

game:
  spin:
    # Maximum spins allowed per player per day
    max_daily_spins: 10
    
    # Weighted distribution for spin results
    # Weight = probability (total weights don't need to sum to 100)
    distribution:
      - points: 300
        weight: 40
      - points: 500
        weight: 35
      - points: 1000
        weight: 20
      - points: 3000
        weight: 5

  # Points required for each reward checkpoint
  reward_checkpoints:
    - 500
    - 1500
    - 3000
    - 5000
    - 10000
```

**Status:** ⬜ Not Started

---

### Task 2.2: Create Pagination Configuration YAML

**File:** `backend/configs/pagination.yaml`

```yaml
# Pagination Configuration

pagination:
  # Default number of items per page
  default_limit: 20
  
  # Maximum allowed items per page
  max_limit: 100
  
  # Default offset
  default_offset: 0
```

**Status:** ⬜ Not Started

---

### Task 2.3: Create Rewards Configuration YAML

**File:** `backend/configs/rewards.yaml`

```yaml
# Reward Configuration
# Seed data for reward_config table

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

**Status:** ⬜ Not Started

---

### Task 2.4: Extend Config Loader with Game/Pagination Config

**File:** `backend/internal/infrastructure/config/game_config.go`

```go
package config

// SpinDistributionItem represents a weighted spin outcome
type SpinDistributionItem struct {
    Points int `mapstructure:"points"`
    Weight int `mapstructure:"weight"`
}

// SpinConfig holds spin-related settings
type SpinConfig struct {
    MaxDailySpins int                    `mapstructure:"max_daily_spins"`
    Distribution  []SpinDistributionItem `mapstructure:"distribution"`
}

// GameConfig holds all game settings
type GameConfig struct {
    Spin             SpinConfig `mapstructure:"spin"`
    RewardCheckpoints []int     `mapstructure:"reward_checkpoints"`
}

// PaginationConfig holds pagination settings
type PaginationConfig struct {
    DefaultLimit  int `mapstructure:"default_limit"`
    MaxLimit      int `mapstructure:"max_limit"`
    DefaultOffset int `mapstructure:"default_offset"`
}

// RewardCheckpointConfig for seeding
type RewardCheckpointConfig struct {
    CheckpointVal     int    `mapstructure:"checkpoint_val"`
    RewardName        string `mapstructure:"reward_name"`
    RewardDescription string `mapstructure:"reward_description"`
}

type RewardsConfig struct {
    Checkpoints []RewardCheckpointConfig `mapstructure:"checkpoints"`
}
```

**File:** `backend/internal/infrastructure/config/config.go` (extend)

```go
// Add to existing Config struct
type Config struct {
    DB         DBConfig
    Server     ServerConfig
    Log        LogConfig
    Game       GameConfig       // NEW
    Pagination PaginationConfig // NEW
    Rewards    RewardsConfig    // NEW
}

// LoadGameConfig loads game.yaml
func LoadGameConfig() (*GameConfig, error)

// LoadPaginationConfig loads pagination.yaml
func LoadPaginationConfig() (*PaginationConfig, error)

// LoadRewardsConfig loads rewards.yaml
func LoadRewardsConfig() (*RewardsConfig, error)

// Init loads all configs
func Init() *Config {
    // Load .env
    // Load game.yaml
    // Load pagination.yaml
    // Load rewards.yaml
    // Merge all into Config struct
}
```

**Requirements:**
- Use Viper's MergeConfig for multiple YAML files
- Support environment variable overrides
- Validate config on load (e.g., distribution weights > 0)
- Log loaded config values

**Status:** ⬜ Not Started

---

## Acceptance Criteria

- [ ] All game settings in game.yaml
- [ ] All pagination settings in pagination.yaml
- [ ] All reward seed data in rewards.yaml
- [ ] Config structs match YAML structure
- [ ] Viper loads all YAML files
- [ ] Environment variables can override YAML values
- [ ] Config validation on startup
- [ ] No hardcoded game values anywhere

---

## Environment Variable Overrides

```bash
# Override game settings
GAME_SPIN_MAX_DAILY_SPINS=20

# Override pagination
PAGINATION_DEFAULT_LIMIT=50
PAGINATION_MAX_LIMIT=200

# Override via .env or system env
```

---

## File Structure After Phase 2

```
backend/
├── configs/
│   ├── game.yaml
│   ├── pagination.yaml
│   └── rewards.yaml
└── internal/
    └── infrastructure/
        └── config/
            ├── config.go       # Main config loader
            └── game_config.go  # Game-specific structs
```

---

## Usage Example

```go
// In main.go
cfg := config.Init()

// Access game config
maxSpins := cfg.Game.Spin.MaxDailySpins
distribution := cfg.Game.Spin.Distribution

// Access pagination config
defaultLimit := cfg.Pagination.DefaultLimit

// Access rewards config (for seeding)
rewards := cfg.Rewards.Checkpoints
```
