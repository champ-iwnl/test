package database

import (
	"fmt"
	"log"

	"backend/internal/infrastructure/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	db *gorm.DB
}

func New(cfg *config.DBConfig) (*Database, error) {
	dsn := cfg.GetDSN()

	log.Printf("[Database] Connecting to PostgreSQL: %s:%d/%s", cfg.Host, cfg.Port, cfg.Database)

	// Configure GORM logger
	gormLogger := logger.Default
	if cfg.SSLMode == "require" {
		gormLogger = logger.Default.LogMode(logger.Silent) // Reduce log noise in production
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Test the connection
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("[Database] ✓ Connected to PostgreSQL successfully")
	return &Database{db: db}, nil
}

func (d *Database) DB() *gorm.DB {
	return d.db
}

func (d *Database) Close() error {
	sqlDB, err := d.db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
