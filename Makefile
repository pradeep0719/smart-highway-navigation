.PHONY: help deploy deploy-dev down logs seed

help:
	@echo "Smart Highway Navigation — available targets:"
	@echo "  make deploy      Build and start production Docker stack"
	@echo "  make deploy-dev  Start stack with dev ports (web:8080, api:5000)"
	@echo "  make down        Stop Docker stack"
	@echo "  make logs        Tail all container logs"
	@echo "  make seed        Seed admin user (requires running Mongo)"

deploy:
	cd deploy && chmod +x scripts/*.sh && ./scripts/deploy.sh

deploy-dev:
	cd deploy && cp -n .env.example .env 2>/dev/null || true
	cd deploy && docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

down:
	cd deploy && docker compose down

logs:
	cd deploy && docker compose logs -f

seed:
	cd backend && npm run seed
