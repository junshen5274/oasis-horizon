#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "Starting PostgreSQL..."
docker compose up -d postgres

echo "Waiting for PostgreSQL to be ready..."
until docker exec oasis-horizon-postgres pg_isready -U oasis -d oasis_horizon >/dev/null 2>&1; do
  sleep 1
done

echo "PostgreSQL is ready."

echo "Starting Oasis Horizon API..."
cd "$PROJECT_ROOT/api"
mvn spring-boot:run -Dspring-boot.run.profiles=local
