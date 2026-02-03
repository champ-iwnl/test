.PHONY: backend-seed backend-migrate-up backend-reset backend-seed-docker backend-migrate-up-docker backend-reset-docker

backend-seed:
	cd backend && go run cmd/migrate/main.go seed

backend-migrate-up:
	cd backend && go run cmd/migrate/main.go up

backend-reset:
	cd backend && go run cmd/migrate/main.go reset

backend-seed-docker:
	docker-compose exec backend go run cmd/migrate/main.go seed

backend-migrate-up-docker:
	docker-compose exec backend go run cmd/migrate/main.go up

backend-reset-docker:
	docker-compose exec backend go run cmd/migrate/main.go reset
