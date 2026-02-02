.PHONY: backend-seed backend-migrate-up backend-reset

backend-seed:
	cd backend && go run cmd/migrate/main.go seed

backend-migrate-up:
	cd backend && go run cmd/migrate/main.go up

backend-reset:
	cd backend && go run cmd/migrate/main.go reset
