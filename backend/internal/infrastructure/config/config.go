package config

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	DB         DBConfig
	Server     ServerConfig
	Log        LogConfig
	Game       GameConfig
	Pagination PaginationConfig
	Rewards    RewardsConfig
	Validation ValidationConfig
}

type DBConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Database string
	SSLMode  string
}

type ServerConfig struct {
	Port int
	Env  string
	// AllowOrigins is a comma-separated list of CORS allowed origins (e.g. "http://localhost:3000,http://127.0.0.1:3000")
	AllowOrigins string `mapstructure:"allow_origins"`
}

type LogConfig struct {
	Level string
}

type RewardsConfig struct {
	Checkpoints []CheckpointItem `mapstructure:"checkpoints"`
}

type CheckpointItem struct {
	CheckpointVal     int    `mapstructure:"checkpoint_val"`
	RewardName        string `mapstructure:"reward_name"`
	RewardDescription string `mapstructure:"reward_description"`
}

type ValidationConfig struct {
	Nickname NicknameValidationConfig `mapstructure:"nickname"`
}

type NicknameValidationConfig struct {
	MinLength int `mapstructure:"min_length"`
	MaxLength int `mapstructure:"max_length"`
}

var config *Config

// Init loads configuration from .env file using godotenv
func Init() *Config {
	// Try to load .env from current directory first
	envPath := ".env"
	if _, err := os.Stat(envPath); os.IsNotExist(err) {
		// Try parent directory
		envPath = "../.env"
	}

	if err := godotenv.Load(envPath); err != nil {
		log.Printf("[Config] Note: Could not load %s, using environment variables or defaults", envPath)
	} else {
		log.Printf("[Config] Loaded .env from %s", envPath)
	}

	// Also try to load from executable directory
	execPath, err := os.Executable()
	if err == nil {
		execDir := filepath.Dir(execPath)
		envExecPath := filepath.Join(execDir, ".env")
		if _, err := os.Stat(envExecPath); err == nil {
			if err := godotenv.Overload(envExecPath); err == nil {
				log.Printf("[Config] Loaded .env from executable directory: %s", envExecPath)
			}
		}
	}

	// Load game configuration from YAML
	viper.SetConfigName("game")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath("../configs")

	// Enable environment variable overrides
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("[Config] Warning: Could not load game.yaml: %v", err)
	} else {
		log.Printf("[Config] ✓ Loaded game config from %s", viper.ConfigFileUsed())
	}

	// Load pagination configuration from YAML
	viper.SetConfigName("pagination")
	if err := viper.MergeInConfig(); err != nil {
		log.Printf("[Config] Warning: Could not load pagination.yaml: %v", err)
	} else {
		log.Printf("[Config] ✓ Loaded pagination config")
	}

	// Load rewards configuration from YAML
	viper.SetConfigName("rewards")
	if err := viper.MergeInConfig(); err != nil {
		log.Printf("[Config] Warning: Could not load rewards.yaml: %v", err)
	} else {
		log.Printf("[Config] ✓ Loaded rewards config")
	}

	// Load validation configuration from YAML
	viper.SetConfigName("validation")
	if err := viper.MergeInConfig(); err != nil {
		log.Printf("[Config] Warning: Could not load validation.yaml: %v", err)
	} else {
		log.Printf("[Config] ✓ Loaded validation config")
	}

	// Read from environment variables
	cfg := &Config{
		DB: DBConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnvInt("DB_PORT", 5432),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			Database: getEnv("DB_NAME", "postgres"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Server: ServerConfig{
			Port:         getEnvInt("SERVER_PORT", 3000),
			Env:          getEnv("SERVER_ENV", "development"),
			AllowOrigins: getEnv("CORS_ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"),
		},
		Log: LogConfig{
			Level: getEnv("LOG_LEVEL", "info"),
		},
	}

	// Load game config
	if err := viper.UnmarshalKey("game", &cfg.Game); err != nil {
		log.Printf("[Config] Warning: Could not unmarshal game config: %v", err)
	}

	// Load pagination config
	if err := viper.UnmarshalKey("pagination", &cfg.Pagination); err != nil {
		log.Printf("[Config] Warning: Could not unmarshal pagination config: %v", err)
	}

	// Load rewards config
	if err := viper.UnmarshalKey("rewards", &cfg.Rewards); err != nil {
		log.Printf("[Config] Warning: Could not unmarshal rewards config: %v", err)
	}

	// Load validation config
	if err := viper.UnmarshalKey("validation", &cfg.Validation); err != nil {
		log.Printf("[Config] Warning: Could not unmarshal validation config: %v", err)
	}

	// Validate configuration
	if err := validateConfig(cfg); err != nil {
		log.Fatalf("[Config] Configuration validation failed: %v", err)
	}

	config = cfg
	log.Printf("[Config] ✓ Loaded configuration:")
	log.Printf("[Config]   DB: %s:%d/%s (sslmode=%s)", cfg.DB.Host, cfg.DB.Port, cfg.DB.Database, cfg.DB.SSLMode)
	log.Printf("[Config]   Server: Port=%d, Env=%s", cfg.Server.Port, cfg.Server.Env)
	log.Printf("[Config]   Game: MaxDailySpins=%d, DistributionItems=%d", cfg.Game.Spin.MaxDailySpins, len(cfg.Game.Spin.Distribution))
	log.Printf("[Config]   Pagination: DefaultLimit=%d, MaxLimit=%d", cfg.Pagination.DefaultLimit, cfg.Pagination.MaxLimit)
	log.Printf("[Config]   Rewards: Checkpoints=%d", len(cfg.Rewards.Checkpoints))

	return cfg
}

// validateConfig validates the loaded configuration
func validateConfig(cfg *Config) error {
	// Validate game config
	if cfg.Game.Spin.MaxDailySpins <= 0 {
		return fmt.Errorf("game.spin.max_daily_spins must be positive")
	}

	totalWeight := 0
	for i, item := range cfg.Game.Spin.Distribution {
		if item.Points <= 0 {
			return fmt.Errorf("game.spin.distribution[%d].points must be positive", i)
		}
		if item.Weight <= 0 {
			return fmt.Errorf("game.spin.distribution[%d].weight must be positive", i)
		}
		totalWeight += item.Weight
	}
	if totalWeight == 0 {
		return fmt.Errorf("game.spin.distribution must have at least one item with positive weight")
	}

	// Validate pagination config
	if cfg.Pagination.DefaultLimit <= 0 {
		return fmt.Errorf("pagination.default_limit must be positive")
	}
	if cfg.Pagination.MaxLimit <= 0 {
		return fmt.Errorf("pagination.max_limit must be positive")
	}
	if cfg.Pagination.DefaultLimit > cfg.Pagination.MaxLimit {
		return fmt.Errorf("pagination.default_limit cannot be greater than max_limit")
	}

	return nil
}

// Helper functions
func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	valStr := os.Getenv(key)
	if valStr != "" {
		var val int
		if _, err := fmt.Sscanf(valStr, "%d", &val); err == nil {
			return val
		}
	}
	return defaultVal
}

// GetConfig returns the loaded configuration
func GetConfig() *Config {
	if config == nil {
		log.Fatal("[Config] Configuration not initialized. Call Init() first")
	}
	return config
}

// GetDSN returns the PostgreSQL Data Source Name (connection string)
func (c *DBConfig) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Host,
		c.Port,
		c.User,
		c.Password,
		c.Database,
		c.SSLMode,
	)
}
