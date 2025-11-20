#!/usr/bin/env bash
# Helper: build backend JAR, start DB, run flyway, and run frontend in dev mode
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# 1) build backend jar
echo "Building backend..."
cd backend
./mvnw -DskipTests package
cd ..

# 2) start db
echo "Starting db..."
docker compose up -d db

# 3) run flyway migrations
echo "Running flyway migrate..."
# Use sudo if needed; try without sudo first
if docker compose run --rm flyway migrate; then
  echo "Migrations applied"
else
  echo "Retrying with sudo..."
  sudo docker compose run --rm flyway migrate
fi

# 4) run frontend dev and backend containers
echo "Starting frontend_dev and backend..."
docker compose up --build -d backend frontend_dev

echo "All services started. Backend: http://localhost:8081 Frontend: http://localhost:5173"

echo "Use 'docker compose logs -f backend' to tail backend logs"
