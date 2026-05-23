#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

./scripts/start-postgres.sh

echo ""
echo "Next steps:"
echo "  Terminal 1: ./scripts/start-api.sh"
echo "  Terminal 2: ./scripts/start-web.sh"
echo ""
echo "Useful URLs:"
echo "  Web: http://localhost:3000/policy-terms"
echo "  API: http://localhost:8080/api/policy-terms?size=1"
