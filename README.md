# Oasis Horizon

Prototype: next-generation, cloud-ready **Policy Inquiry/Search** for underwriters.

## v1 highlights
- Read-only
- ~1,000 seeded policies (fake data)
- Modern UI redesign
- AI drawer:
  - Natural-language search → structured filters
  - Policy summary grounded in data

## Repo structure
- /web  Next.js frontend
- /api  Spring Boot backend

## Run
### Web (Next.js)
```bash
cd web
npm install
npm run dev
```

### API (Spring Boot)
```bash
cd api
mvn spring-boot:run
```

### Running locally (web)
Default route:
- `http://localhost:3000/policy-terms`

Optional URL params for `/policy-terms`:
- `q`, `state`, `status`, `date_field`, `date_from`, `date_to`, `page`, `size`, `sort`
- `date_field` may be `expiration` (default) or `effective`

Pagination defaults:
- `page=0`
- `size=20` (default page size)

Example:
- `http://localhost:3000/policy-terms?q=OH&state=AZ&page=0&size=20`
- `http://localhost:3000/policy-terms?date_field=expiration&date_from=2025-01-01&date_to=2025-12-31`
- `http://localhost:3000/policy-terms?date_field=effective&date_from=2024-01-01&date_to=2024-06-30`

## Local startup
Use the helper scripts to start local dependencies and services in order:

```bash
./scripts/start-postgres.sh
./scripts/start-api.sh
./scripts/start-web.sh
```

Note: `./scripts/start-postgres.sh` checks Docker availability first. On macOS, if Docker is not running, it will attempt to launch Docker Desktop automatically and wait for the daemon to become ready.

Or run just the dependency bootstrap + guidance:

```bash
./scripts/start-local.sh
```

## Phase 2: Postgres + seed + Policy Term APIs
### Start Postgres (local dev)
```bash
docker compose up -d
```

### Run API with local profile (Postgres + deterministic seed)
```bash
cd api
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Verify endpoints
```bash
curl "http://localhost:8080/api/policy-terms?size=10"
curl "http://localhost:8080/api/policy-terms?q=OH-000001&state=NY&status=ACTIVE&date_field=expiration&date_from=2026-01-01&date_to=2026-12-31"
curl "http://localhost:8080/api/policy-terms?state=CA&status=CANCELLED"
curl "http://localhost:8080/api/policy-terms?date_field=effective&date_from=2025-01-01&date_to=2025-12-31"
curl "http://localhost:8080/api/policy-terms?date_field=expiration&date_from=2026-01-01&date_to=2026-12-31"
curl "http://localhost:8080/api/policy-terms/{termId}"
```
