package main

import (
	"fmt"
	"log"

	"backend/internal/adapter/http/routes"
	"backend/internal/infrastructure/config"
	"backend/internal/infrastructure/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// Load configuration from .env in current directory
	cfg := config.Init()

	// Initialize database
	db, err := database.New(&cfg.DB)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer func() {
		sqlDB, _ := db.DB().DB()
		sqlDB.Close()
	}()

	// Ping database to verify connection
	sqlDB, err := db.DB().DB()
	if err != nil {
		log.Fatalf("Failed to get sql.DB: %v", err)
	}
	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("Database ping failed: %v", err)
	}
	log.Println("✓ Database connected successfully")

	// Create Fiber app
	app := fiber.New()

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())

	// Setup routes
	routes.Setup(app)

	// Start server
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("Starting Spin Head API v1.0.0 on %s\n", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
