#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

DOCKER_TIMEOUT_SECONDS=60

if docker info >/dev/null 2>&1; then
  echo "Docker daemon is running."
else
  if [ "$(uname -s)" = "Darwin" ]; then
    echo "Docker is not running. Attempting to start Docker Desktop..."
    open -a Docker

    elapsed=0
    while ! docker info >/dev/null 2>&1; do
      if [ "$elapsed" -ge "$DOCKER_TIMEOUT_SECONDS" ]; then
        echo "Docker did not become ready within ${DOCKER_TIMEOUT_SECONDS} seconds."
        echo "Please ensure Docker Desktop is running and try again."
        exit 1
      fi

      echo "Waiting for Docker to be ready... (${elapsed}s/${DOCKER_TIMEOUT_SECONDS}s)"
      sleep 2
      elapsed=$((elapsed + 2))
    done

    echo "Docker is ready."
  else
    echo "Docker is not running. Please start Docker manually and re-run this script."
    exit 1
  fi
fi

echo "Starting PostgreSQL service (postgres) with Docker Compose..."
docker compose up -d postgres

echo "PostgreSQL service status:"
docker compose ps postgres

echo "PostgreSQL startup command completed."
