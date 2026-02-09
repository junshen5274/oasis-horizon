# Implementation Plan — Oasis Horizon (v1)

## Phase 0: Repo + docs baseline
- Create monorepo folders: /web, /api
- Add core docs (AGENTS.md, PRD.md, TECH_STACK.md, APP_FLOW.md, TASKS.md)
- Decide local dev workflow (docker compose optional)

## Phase 1: Skeleton apps
- Web app boots (Next.js)
- API boots (Spring Boot)
- Basic health endpoints
- Simple "hello" pages

## Phase 2: Seed data + persistence
- Postgres setup
- Seed generator for ~1,000 policies
- Read-only API endpoints for:
  - search
  - policy detail

## Phase 3: UI (modern redesign)
- Search page UI
- Results table UI
- Policy detail UI
- AI drawer UI shell

## Phase 4: Wire UI ↔ API
- Fetch search results + policy detail
- Loading/error states

## Phase 5: AI features
- NL query → structured filters (validated)
- Policy summary (grounded)
- Simple audit log of prompts/responses

## Phase 6: Demo polish
- Demo dataset polish
- Small UX improvements
- README with run steps
