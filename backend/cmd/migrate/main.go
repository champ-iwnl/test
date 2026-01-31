package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"backend/internal/infrastructure/config"
	"backend/internal/infrastructure/database"
	"backend/internal/infrastructure/database/migrations"
)

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	command := os.Args[1]

	// Initialize configuration
	cfg := config.Init()

	// Initialize database connection
	db, err := database.New(cfg.Database)
	if err != nil {
		log.Fatalf("[Migrate] Failed to connect to database: %v", err)
	}
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	// Create migrator
	migrator, err := migrations.NewMigrator(db, cfg)
	if err != nil {
		log.Fatalf("[Migrate] Failed to create migrator: %v", err)
	}
	defer migrator.Close()

	// Execute command
	switch command {
	case "up":
		if err := migrator.Up(); err != nil {
			log.Fatalf("[Migrate] Up failed: %v", err)
		}
		log.Println("[Migrate] ✓ Migrations up completed successfully")

	case "down":
		if err := migrator.Down(); err != nil {
			log.Fatalf("[Migrate] Down failed: %v", err)
		}
		log.Println("[Migrate] ✓ Migration down completed successfully")

	case "reset":
		if err := migrator.Reset(); err != nil {
			log.Fatalf("[Migrate] Reset failed: %v", err)
		}
		log.Println("[Migrate] ✓ Database reset completed successfully")

	case "seed":
		seeder := migrations.NewSeeder(db, cfg)
		if err := seeder.SeedAll(context.Background()); err != nil {
			log.Fatalf("[Migrate] Seed failed: %v", err)
		}
		log.Println("[Migrate] ✓ Seeding completed successfully")

	case "version":
		version, dirty, err := migrator.Version()
		if err != nil {
			log.Fatalf("[Migrate] Version check failed: %v", err)
		}
		status := "clean"
		if dirty {
			status = "dirty"
		}
		fmt.Printf("Current migration version: %d (%s)\n", version, status)

	default:
		fmt.Printf("Unknown command: %s\n\n", command)
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("SpinHead Database Migration Tool")
	fmt.Println()
	fmt.Println("Usage:")
	fmt.Println("  migrate up      - Run all pending migrations")
	fmt.Println("  migrate down    - Rollback last migration")
	fmt.Println("  migrate reset   - Drop all tables and run all migrations")
	fmt.Println("  migrate seed    - Seed database with initial data")
	fmt.Println("  migrate version - Show current migration version")
	fmt.Println()
	fmt.Println("Examples:")
	fmt.Println("  go run cmd/migrate/main.go up")
	fmt.Println("  go run cmd/migrate/main.go reset")
	fmt.Println("  go run cmd/migrate/main.go seed")
}
