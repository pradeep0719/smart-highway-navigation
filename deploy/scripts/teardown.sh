#!/usr/bin/env bash
# Stop and remove containers (keeps MongoDB volume by default)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$DEPLOY_DIR"

docker compose down

echo "Containers stopped. Data volume 'mongo_data' preserved."
echo "To remove volumes too: docker compose down -v"
