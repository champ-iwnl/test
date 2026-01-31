# รัน migrations
go run cmd/migrate/main.go up

# Rollback migration ล่าสุด
go run cmd/migrate/main.go down

# Reset database (drop และ recreate ทุกอย่าง)
go run cmd/migrate/main.go reset

# Seed reward configuration
go run cmd/migrate/main.go seed

# ตรวจสอบ migration version
go run cmd/migrate/main.go version