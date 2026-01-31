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
	Spin              SpinConfig `mapstructure:"spin"`
	RewardCheckpoints []int      `mapstructure:"reward_checkpoints"`
}

// PaginationConfig holds pagination settings
type PaginationConfig struct {
	DefaultLimit  int `mapstructure:"default_limit"`
	MaxLimit      int `mapstructure:"max_limit"`
	DefaultOffset int `mapstructure:"default_offset"`
}
