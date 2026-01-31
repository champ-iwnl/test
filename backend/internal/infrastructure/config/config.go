package config

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	DB      DBConfig
	Server  ServerConfig
	Log     LogConfig
	Rewards RewardsConfig
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
			if err := godotenv.OverLoad(envExecPath); err == nil {
				log.Printf("[Config] Loaded .env from executable directory: %s", envExecPath)
			}
		}
	}

	// Load rewards configuration from YAML
	viper.SetConfigName("rewards")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath("../configs")

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("[Config] Note: Could not load rewards.yaml, using defaults: %v", err)
	} else {
		log.Printf("[Config] ✓ Loaded rewards config from %s", viper.ConfigFileUsed())
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
			Port: getEnvInt("SERVER_PORT", 3000),
			Env:  getEnv("SERVER_ENV", "development"),
		},
		Log: LogConfig{
			Level: getEnv("LOG_LEVEL", "info"),
		},
	}

	// Load rewards config
	if err := viper.UnmarshalKey("rewards", &cfg.Rewards); err != nil {
		log.Printf("[Config] Warning: Could not unmarshal rewards config: %v", err)
	}

	config = cfg
	log.Printf("[Config] ✓ Loaded configuration: DB=%s:%d (sslmode=%s), Server Port=%d, Env=%s",
		cfg.DB.Host, cfg.DB.Port, cfg.DB.SSLMode, cfg.Server.Port, cfg.Server.Env)

	return cfg
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
