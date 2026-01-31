package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	DB struct {
		Host     string
		Port     int
		User     string
		Password string
		Name     string
		SSLMode  string
	}
	Server struct {
		Port int
		Env  string
	}
	Log struct {
		Level string
	}
}

var cfg Config

func Init() *Config {
	// Load .env file
	_ = godotenv.Load()

	// Load from environment variables with fallback defaults
	cfg.DB.Host = getEnv("DB_HOST", "localhost")
	cfg.DB.Port = getEnvInt("DB_PORT", 5432)
	cfg.DB.User = getEnv("DB_USER", "postgres")
	cfg.DB.Password = getEnv("DB_PASSWORD", "postgres")
	cfg.DB.Name = getEnv("DB_NAME", "postgres")
	cfg.DB.SSLMode = getEnv("DB_SSLMODE", "disable")
	cfg.Server.Port = getEnvInt("SERVER_PORT", 3001)
	cfg.Server.Env = getEnv("SERVER_ENV", "development")
	cfg.Log.Level = getEnv("LOG_LEVEL", "info")

	log.Printf("✓ Config loaded: DB=%s:%d, SERVER_PORT=%d, ENV=%s, SSLMODE=%s\n",
		cfg.DB.Host, cfg.DB.Port, cfg.Server.Port, cfg.Server.Env, cfg.DB.SSLMode)

	return &cfg
}

func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultVal
}

func GetDSN() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.DB.Host, cfg.DB.Port, cfg.DB.User, cfg.DB.Password, cfg.DB.Name, cfg.DB.SSLMode)
}
