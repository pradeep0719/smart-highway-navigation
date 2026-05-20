#!/usr/bin/env bash
# Build and start the full production stack
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$DEPLOY_DIR"

if [[ ! -f .env ]]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "⚠️  Edit deploy/.env with production secrets before going live."
fi

echo "Building and starting containers..."
docker compose up -d --build

echo ""
echo "✅ Stack is running"
echo "   App:    http://localhost:${HTTP_PORT:-80}"
echo "   Health: http://localhost:${HTTP_PORT:-80}/api/health (via nginx proxy)"
echo ""
echo "Default admin (if seeded):"
echo "   Email:    admin@smarthighway.local"
echo "   Password: (see ADMIN_PASSWORD in deploy/.env)"
echo ""
docker compose ps
