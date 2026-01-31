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
	db := database.New(cfg)
	defer db.Close()

	// Ping database to verify connection
	if err := db.Ping(); err != nil {
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
