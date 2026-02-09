# Tech Stack — Oasis Horizon (v1)

## Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Table/grid: start simple; can adopt TanStack Table if needed.

## Backend
- Java + Spring Boot (modular monolith)
- REST APIs (read-only)
- Validation at API boundary

## Database
- PostgreSQL
- Seed data generator (reproducible)
- Simple audit table for AI prompts/responses

## AI (v1)
- Implement:
  - NL query → structured filters
  - Policy summary
- Guardrails:
  - read-only only
  - show interpreted filters before applying
  - summaries must be grounded in real fields
