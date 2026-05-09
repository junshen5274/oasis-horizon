# Implementation Plan — Oasis Horizon (v1)

## Current Focus

Phase 6 AI Search v1: deterministic local natural-language parser in the Assistant drawer.

---

## Phase 0: Repo + docs baseline ✅ Completed
- Create monorepo folders: `/web`, `/api`
- Add core docs (`AGENTS.md`, `PRD.md`, `TECH_STACK.md`, `APP_FLOW.md`, `TASKS.md`)
- Decide local dev workflow with Docker Compose for Postgres

## Phase 1: Skeleton apps ✅ Completed
- Web app boots with Next.js
- API boots with Spring Boot
- Basic local development workflow established

## Phase 2: Seed data + persistence ✅ Completed
- Postgres setup
- Flyway migration for `policy` and `policy_term`
- Local deterministic seed data
- Read-only API endpoints for:
  - policy term search/list
  - policy term detail

## Phase 3: UI modern redesign ✅ Completed
- Policy terms list page
- Results table UI
- Policy term detail page
- AI drawer UI shell

## Phase 4: Wire UI ↔ API ✅ Completed
- Fetch policy term results from API
- Fetch policy term detail from API
- Loading/error state handling
- URL-driven search and pagination params

## Phase 5: Server-side filter correctness ✅ Completed

### Goal
Move all `/policy-terms` filters fully server-side so pagination, total count, and empty states are correct.

### Current Issue
The frontend currently sends only part of the filter state to the API, then applies some filters on the current fetched page. This can create incorrect behavior, such as showing “No matches on this page” even though matching records exist on another page.

### Desired API Parameters
The `/api/policy-terms` endpoint should support:

- `q`
- `state`
- `status`
- `date_field=effective|expiration`
- `date_from`
- `date_to`
- `page`
- `size`
- `sort`

### Date Field Behavior
- `date_field=effective` filters by `effectiveFromDate`
- `date_field=expiration` filters by `effectiveToDate`
- Missing `date_field` defaults to `expiration`
- Unsupported `date_field` returns `400 Bad Request`

### Backend Changes
Update `api/src/main/java/com/oasishorizon/api/policy/PolicyTermController.java`:

- Replace `exp_from` / `exp_to` request parameters with:
  - `date_field`
  - `date_from`
  - `date_to`
- Validate `date_field`; only allow `effective` or `expiration`
- Pass normalized date field and date range to the service

Update `api/src/main/java/com/oasishorizon/api/policy/PolicyTermService.java`:

- Update `search(...)` and `buildSpecification(...)` signatures
- Choose date property dynamically:
  - `effective` → `effectiveFromDate`
  - `expiration` → `effectiveToDate`
- Apply `date_from` and `date_to` against the selected date property
- Keep `state` and `status` as exact case-insensitive matches for now

### Frontend Changes
Update `web/lib/api.ts`:

- Replace `exp_from` / `exp_to` in `PolicyTermSearchParams` with:
  - `date_field?: "effective" | "expiration"`
  - `date_from?: string`
  - `date_to?: string`
- Send `state`, `status`, `date_field`, `date_from`, and `date_to` to the API when present

Update `web/app/policy-terms/page.tsx`:

- Pass all URL filter state into `fetchPolicyTerms(...)`
- Stop using current-page-only client-side filtering
- Use `termPage.items` directly as visible results
- Remove `inDateRange(...)` and `applyClientSideFilters(...)`
- Replace the page-scoped empty state with one global empty state:
  - “No policy terms matched your filters.”

### README Changes
Update `README.md`:

- Replace `exp_from` / `exp_to` documentation with:
  - `date_field`
  - `date_from`
  - `date_to`
- Add examples for both expiration-date and effective-date filtering

### Manual Test Cases
API tests:

- Basic list: `/api/policy-terms?size=10`
- State filter: `/api/policy-terms?state=CA&size=10`
- Status filter: `/api/policy-terms?status=ACTIVE&size=10`
- Keyword search: `/api/policy-terms?q=OH-000001&size=10`
- Expiration date filter: `/api/policy-terms?date_field=expiration&date_from=2024-01-01&date_to=2024-12-31&size=10`
- Effective date filter: `/api/policy-terms?date_field=effective&date_from=2024-01-01&date_to=2024-12-31&size=10`
- Invalid date field: `/api/policy-terms?date_field=badvalue&size=10` should return HTTP 400

UI tests:

- Apply state filter and confirm all visible rows match
- Apply status filter and confirm all visible rows match
- Apply expiration date range and confirm all visible rows match
- Apply effective date range and confirm all visible rows match
- Use pagination while filters are active and confirm filters remain in the URL
- Confirm the incorrect “No matches on this page” behavior is removed

### Suggested Commit Message

```text
Move policy term filters fully server-side
```

Suggested commit details:

```text
- Add date_field/date_from/date_to API parameters
- Support effective-date and expiration-date filtering
- Send all filters from policy terms page to API
- Remove current-page-only client-side filtering
- Simplify empty-state behavior
- Update README API examples
```

## Phase 6: AI Search v1 🚧 In Progress

### Goal
The AI drawer should convert natural-language search requests into structured `/policy-terms` filters.

Example user request:

```text
Show active CA policies expiring in 2026
```

Expected structured filter output:

```json
{
  "q": "",
  "state": "CA",
  "status": "ACTIVE",
  "date_field": "expiration",
  "date_from": "2026-01-01",
  "date_to": "2026-12-31"
}
```

The UI should apply those values to the `/policy-terms` URL.

### Phase 6 v1 Note

Do not integrate the OpenAI API yet. The first implementation uses a deterministic local parser so the search flow works without API keys.

## Phase 7: Policy Summary v1

Start this after AI Search v1.

### Goal
The AI drawer should generate a grounded policy summary from the currently loaded policy term detail data.

Rules:

- Only summarize fields available from the API
- Do not invent missing policy, risk, billing, or claim information
- Clearly indicate when a detail is not available in the current prototype data

## Phase 8: Demo polish

- Demo dataset polish
- Better policy detail sections
- Status badge styling
- Page-size selector
- README screenshots or short GIF
- One-command local startup script
- Optional GitHub Actions build check
