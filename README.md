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
- `q`, `state`, `status`, `exp_from`, `exp_to`, `page`, `size`, `sort`

Pagination defaults:
- `page=0`
- `size=20` (default page size)

Example:
- `http://localhost:3000/policy-terms?q=OH&state=AZ&page=0&size=20`

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
curl "http://localhost:8080/api/policy-terms?q=OH-000001&state=CA&status=ACTIVE&exp_from=2024-01-01&exp_to=2026-12-31"
curl "http://localhost:8080/api/policy-terms/{termId}"
```
