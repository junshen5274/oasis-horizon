#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "Starting PostgreSQL service (postgres) with Docker Compose..."
docker compose up -d postgres

echo "PostgreSQL service status:"
docker compose ps postgres

echo "PostgreSQL startup command completed."
