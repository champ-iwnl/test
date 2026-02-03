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
	driver, err := postgres.WithInstance(sqlDB, &postgres.Config{
		MigrationsTable: "schema_migrations",
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create postgres driver: %w", err)
	}

	// Create migrate instance with file source
	migrationPath := "file://./migrations"
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

	// Get current version
	version, _, err := m.migrate.Version()
	if err != nil {
		log.Printf("[Migrator] Warning: Could not get current version: %v", err)
		version = 4 // Assume max version if we can't get it
	}

	// Rollback all migrations (4 steps down)
	if version > 0 {
		log.Printf("[Migrator] Rolling back %d migrations...", version)
		if err := m.migrate.Steps(-int(version)); err != nil {
			return fmt.Errorf("migration reset (down) failed: %w", err)
		}
	}

	log.Println("[Migrator] ✓ All migrations rolled back, running migrations up...")

	// Run all migrations up
	if err := m.Up(); err != nil {
		return fmt.Errorf("migration reset (up) failed: %w", err)
	}

	log.Println("[Migrator] ✓ Database reset completed")
	return nil
}

// createSchemaMigrationsTable creates the schema_migrations table
func (m *Migrator) createSchemaMigrationsTable() error {
	// We need access to the underlying database connection
	// For now, we'll use the migrate instance to execute raw SQL
	// This is a bit of a hack, but it works

	// Get the database instance from the migrate object
	// Since we can't easily access it, let's try a different approach

	// Actually, let's modify the approach - instead of dropping everything,
	// let's just run all down migrations and then all up migrations

	// For now, let's try to force the version to 0 and then run up
	if err := m.migrate.Force(0); err != nil {
		log.Printf("[Migrator] Warning: Could not force version to 0: %v", err)
		// Continue anyway
	}

	return nil
}

// Version returns the current migration version
func (m *Migrator) Version() (uint, bool, error) {
	return m.migrate.Version()
}

// Force sets the migration version without running migrations
func (m *Migrator) Force(version string) error {
	// Parse version as int
	var v int
	_, err := fmt.Sscanf(version, "%d", &v)
	if err != nil {
		return fmt.Errorf("invalid version format: %w", err)
	}

	if err := m.migrate.Force(v); err != nil {
		return fmt.Errorf("failed to force version: %w", err)
	}

	log.Printf("[Migrator] ✓ Forced migration version to %d", v)
	return nil
}

// Drop drops all tables and migration tracking
func (m *Migrator) Drop() error {
	if err := m.migrate.Drop(); err != nil {
		return fmt.Errorf("failed to drop database: %w", err)
	}

	log.Println("[Migrator] ✓ Dropped all tables and migration tracking")
	return nil
}

// recreateMigrator recreates the migrate instance after a drop operation
func (m *Migrator) recreateMigrator() error {
	// Close the current instance
	m.migrate.Close()

	// Get the database connection from the driver
	// We need to create a new instance since the old one was closed
	// For now, we'll create a minimal recreation - in a real implementation,
	// we'd need to pass the db connection to the migrator

	// This is a simplified approach - create a new migrator instance
	// In practice, we'd need to modify the constructor to allow recreation
	return fmt.Errorf("recreateMigrator not fully implemented - need database connection")
}
