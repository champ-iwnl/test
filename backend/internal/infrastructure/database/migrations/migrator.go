package migrations

import (
	"fmt"
	"log"

	"backend/internal/infrastructure/config"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/gorm"
)

// Migrator handles database migrations
type Migrator struct {
	migrate *migrate.Migrate
}

// NewMigrator creates a new migrator instance
func NewMigrator(db *gorm.DB, cfg *config.Config) (*Migrator, error) {
	// Get underlying sql.DB from GORM
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB from GORM: %w", err)
	}

	// Create postgres driver instance
	driver, err := postgres.WithInstance(sqlDB, &postgres.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to create postgres driver: %w", err)
	}

	// Create migrate instance with file source
	migrationPath := "file://migrations"
	if cfg.Server.Env == "production" {
		migrationPath = "file://./migrations"
	}

	m, err := migrate.NewWithDatabaseInstance(migrationPath, "postgres", driver)
	if err != nil {
		return nil, fmt.Errorf("failed to create migrate instance: %w", err)
	}

	return &Migrator{
		migrate: m,
	}, nil
}

// Up runs all pending migrations
func (m *Migrator) Up() error {
	log.Println("[Migrator] Running migrations up...")

	if err := m.migrate.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("migration up failed: %w", err)
	}

	version, dirty, err := m.migrate.Version()
	if err != nil {
		log.Printf("[Migrator] ✓ Migrations completed (version check failed: %v)", err)
	} else {
		status := "clean"
		if dirty {
			status = "dirty"
		}
		log.Printf("[Migrator] ✓ Migrations completed (version: %d, status: %s)", version, status)
	}

	return nil
}

// Down rolls back the last migration
func (m *Migrator) Down() error {
	log.Println("[Migrator] Rolling back last migration...")

	if err := m.migrate.Steps(-1); err != nil {
		return fmt.Errorf("migration down failed: %w", err)
	}

	version, dirty, err := m.migrate.Version()
	if err != nil {
		log.Printf("[Migrator] ✓ Rollback completed (version check failed: %v)", err)
	} else {
		status := "clean"
		if dirty {
			status = "dirty"
		}
		log.Printf("[Migrator] ✓ Rollback completed (version: %d, status: %s)", version, status)
	}

	return nil
}

// Reset drops all tables and runs all migrations again
func (m *Migrator) Reset() error {
	log.Println("[Migrator] Resetting database...")

	// Drop all tables (equivalent to down all)
	if err := m.migrate.Drop(); err != nil {
		return fmt.Errorf("migration reset (drop) failed: %w", err)
	}

	log.Println("[Migrator] ✓ All tables dropped, running migrations up...")

	// Run all migrations up
	if err := m.Up(); err != nil {
		return fmt.Errorf("migration reset (up) failed: %w", err)
	}

	log.Println("[Migrator] ✓ Database reset completed")
	return nil
}

// Version returns the current migration version
func (m *Migrator) Version() (uint, bool, error) {
	return m.migrate.Version()
}

// Close closes the migrator
func (m *Migrator) Close() error {
	sourceErr, dbErr := m.migrate.Close()
	if sourceErr != nil {
		return fmt.Errorf("failed to close migration source: %w", sourceErr)
	}
	if dbErr != nil {
		return fmt.Errorf("failed to close migration database: %w", dbErr)
	}
	return nil
}
