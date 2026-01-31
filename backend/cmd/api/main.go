package main

import (
	"fmt"
	"log"

	_ "backend/docs" // This is required for swagger
	"backend/internal/adapter/http/routes"
	"backend/internal/infrastructure/config"
	"backend/internal/infrastructure/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

// @title Spin Head API
// @version 1.0
// @description A spin game API built with Go and Fiber
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:3001
// @BasePath /

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

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

	// Enable CORS for frontend origin(s)
	// Enable CORS for frontend origin(s) (configurable via CORS_ALLOW_ORIGINS)
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.Server.AllowOrigins,
		AllowCredentials: true,
	}))

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())

	// Setup routes
	routes.Setup(app, db.DB(), cfg)

	// Start server
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("Starting Spin Head API v1.0.0 on %s\n", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
