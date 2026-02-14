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

## Phase 5: AI features + filter correctness + UX ✅ Completed
- NL query → structured filters (validated)
- Policy summary (grounded)
- Simple audit log of prompts/responses
- URL-driven filter correctness hotfix for `/policy-terms` (safe defaults for pagination)

### Phase 5 Notes
- `/policy-terms` filters are URL-driven and shareable/bookmarkable.
- Pagination defaults are `page=0` and `size=20` when params are missing/invalid.
- The web app never sends `size < 1` to the API.

## Phase 6: Demo polish
- Demo dataset polish
- Small UX improvements
- README with run steps


## Future backend improvements (avoid client-side filtering)

Current prototype behavior on `/policy-terms` includes some client-side filtering on the current fetched page (State/Status partial match and date field choice). This keeps v1 moving without changing API contracts, but the real system should move these filters fully server-side.

Recommended API/data enhancements:
- Add Postgres `ILIKE` partial matching for `state` and `status` (and other text fields where partial search is useful).
- Add server-side date filtering with explicit date-field choice (`date_field=effective|expiration`) and date range (`date_from`, `date_to`).
- Implement end-to-end in controller → service → repository so pagination and sorting remain correct across the full dataset.
- Return accurate filtered totals from the API so the UI can distinguish true global empty states vs page-local empties.
- Keep query params stable for the web app: `state`, `status`, `date_field`, `date_from`, `date_to`.
