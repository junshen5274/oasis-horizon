# Oasis Horizon — Agent Instructions (AGENTS.md)

## Project summary
Oasis Horizon is a prototype rebuild of an insurance system module: **Policy Inquiry/Search** for **underwriters**.

## v1 scope (strict)
- Read-only application (NO write operations).
- Seeded dataset: ~1,000 policies (fake data).
- Modern UI redesign (not Oasis look/clone).
- AI features (read-only):
  1) Natural-language search → structured filters (validated)
  2) Policy summary panel (grounded in policy + fake billing fields)
- AI UI pattern: **right drawer** (slide-over panel). On small screens it should behave naturally as a drawer.

## Out of scope (v1)
- No endorsements, binding, rating, claims creation, billing transactions, payments.
- No multi-tenant implementation.
- No complex billing logic (only simple fake fields).
- No external integrations required for v1.

## Tech stack (locked for v1)
- Frontend: Next.js + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Java + Spring Boot
- Database: Postgres

## Working style rules
- Make small, reviewable changes: one task == one PR-sized change.
- Before coding: write a short plan with files touched + acceptance checks.
- Do not add new technologies without updating TECH_STACK.md and getting agreement.
- Keep the codebase simple: modular monolith backend; no microservices for v1.
- Prefer clarity over cleverness. Add comments where business meaning matters.

## Quality gates
- Frontend: TypeScript strict mode (or as strict as reasonable), linting, basic tests where valuable.
- Backend: clean package structure, validation, basic tests for core logic.
- All endpoints must be read-only and must validate inputs.
- Seed data must be reproducible (same seed -> same dataset if possible).

## AI safety + correctness
- AI can only propose filters/summaries. No write actions.
- Always show the interpreted structured filters to users before applying them.
- Summaries must be grounded in available fields; do not invent facts.
- Log AI inputs/outputs in a simple audit log (ok to store locally in DB for v1).

## Repo conventions
- Use a monorepo structure:
  - /web  (Next.js)
  - /api  (Spring Boot)
  - /docs (optional)
- Keep docs in repo root unless they’re large.
