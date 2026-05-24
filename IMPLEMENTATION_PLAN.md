# Implementation Plan — Oasis Horizon (v1)

## Current Focus

Phase 8 Demo polish is completed. Phase 9 AI-backed assistant v1 is planned as the next major direction.

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

### Completed Behavior
The `/api/policy-terms` endpoint supports:

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

### Backend Completion Notes
`api/src/main/java/com/oasishorizon/api/policy/PolicyTermController.java`:

- Accepts `date_field`, `date_from`, and `date_to`
- Validates `date_field`; only allows `effective` or `expiration`
- Passes normalized date field and date range to the service

`api/src/main/java/com/oasishorizon/api/policy/PolicyTermService.java`:

- Chooses date property dynamically:
  - `effective` → `effectiveFromDate`
  - `expiration` → `effectiveToDate`
- Applies `date_from` and `date_to` against the selected date property
- Keeps `state` and `status` as exact case-insensitive matches for now

### Frontend Completion Notes
`web/lib/api.ts`:

- Uses `date_field`, `date_from`, and `date_to` in `PolicyTermSearchParams`
- Sends `state`, `status`, `date_field`, `date_from`, and `date_to` to the API when present

`web/app/policy-terms/page.tsx`:

- Passes all URL filter state into `fetchPolicyTerms(...)`
- Uses `termPage.items` directly as visible results
- Removed current-page-only client-side filtering
- Removed the page-scoped empty state
- Uses one global empty state:
  - “No policy terms matched your filters.”

### Documentation Completion Notes
- README examples were updated from `exp_from` / `exp_to` to `date_field`, `date_from`, and `date_to`
- Examples now cover both expiration-date and effective-date filtering

### Verification Completed
- `mvn test` passed, though there are no backend test sources yet
- `npm run lint` passed
- `npm run build` passed
- `git diff --check` passed

### Future Follow-up
Add backend controller/service tests for:

- `date_field=badvalue` returns 400
- `date_field=effective` filters by effective date
- `date_field=expiration` filters by expiration date
- missing `date_field` defaults to expiration
- optional future validation: `date_from` must be <= `date_to`

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

## Phase 6: AI Search v1 ✅ Completed

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

### Recommended v1 Approach
Start with a deterministic local parser before integrating any external AI API.

This keeps the product flow simple and safe:

- No API key required
- No backend AI proxy required yet
- No prompt/audit/security concerns yet
- Easy to test the drawer-to-filter workflow

### Phase 6 Scope
- Replace the AI Search placeholder in the Assistant drawer with a small natural-language search form
- Add a parser utility, such as `web/lib/policy-search-parser.ts`
- Detect common search intent:
  - state codes such as `CA`, `NY`, `TX`, `FL`, `IL`, `WA`, `OR`, `AZ`, `CO`, `GA`
  - statuses such as `active`, `expired`, `cancelled`, `canceled`, `non-renewed`
  - date field words such as `expiring`, `expires`, `expiration`, `effective`, `starts`, `starting`
  - four-digit years such as `2026`
- Preview parsed filters before applying them
- Apply filters by updating the `/policy-terms` URL
- Reset `page` to `0` when applying AI-generated filters

### Completion Notes
- Added deterministic local natural-language parser for policy search prompts
- Added AI Search form in the Assistant drawer
- Added structured filter preview
- Apply Filters updates the `/policy-terms` URL using existing server-side filters
- No external AI API integration yet

### Future Follow-up
The current AI Search v1 uses a deterministic parser. This is good enough for demo and local use, but it will not handle all natural-language variations. A future phase should add an AI-backed intent parser that converts user prompts into a validated structured filter object, while keeping the existing server-side `/api/policy-terms` search as the execution layer.

## Phase 7: Policy Summary v1 ✅ Completed

### Goal
The AI drawer should generate a grounded policy summary from the currently loaded policy term detail data.

Rules:

- Only summarize fields available from the API
- Do not invent missing policy, risk, billing, or claim information
- Clearly indicate when a detail is not available in the current prototype data

### Phase 7 v1 Note

Do not integrate the OpenAI API yet. The first implementation uses deterministic summary text grounded only in the loaded policy term detail fields.

### Completion Notes

- Policy term detail pages pass loaded policy detail data into the Assistant drawer
- The Policy Summary tab renders deterministic summary text and a field preview using only API fields
- List pages show a prompt to open a policy term detail page before generating a summary
- AI Search v1 behavior remains available in the same drawer


## Phase 8: Demo polish

- Demo dataset polish ✅ Completed
- Better policy detail sections ✅ Completed
- Status badge styling ✅ Completed
- Page-size selector ✅ Completed
- README screenshots or short GIF ✅ Completed
- Guided local startup helper script ✅ Completed
- Optional GitHub Actions build check ✅ Completed

### Completion Notes
- README now includes a concise demo preview section with screenshots for the policy terms list, filtered list, policy detail page, and assistant drawer behavior.
- Local seed data now reserves deterministic demo policies for common searches across key states, statuses, realistic insured names, policy-number lookup, and 2023-2027 date scenarios.
- Policy terms list now displays status values as compact badges with readable styling by status.
- Policy terms list now includes a 10 / 20 / 50 page-size selector that updates the `size` URL parameter, resets `page` to `0`, and preserves active filters and sort.
- Policy term detail pages now use clearer overview, term date, policy info, and prototype notes sections, and reuse the shared status badge styling.
- Added a minimal GitHub Actions workflow at `.github/workflows/build.yml` for `pull_request` and pushes to `main`.
- CI validates backend with `mvn test` in `/api` and frontend in `/web` with dependency install, `npm run lint`, and `npm run build`; no deploy, Docker, DB service, secrets, or external AI API calls.
- Local startup helper script behavior is now documented as guided (not fully one-command): `scripts/start-local.sh` starts Docker/Postgres and prints next-step commands and local URLs, while API and web are intentionally run in separate terminals so logs remain easy to monitor.

## Phase 9: AI-backed assistant v1 (Planned / Next)

### Goal
Use an AI model to interpret flexible natural-language search requests and return a validated structured filter object. The AI must not directly query the database or execute business logic.

Recommended architecture:

```text
User prompt
→ backend assistant endpoint
→ AI model returns strict JSON
→ backend validates JSON
→ frontend applies filters through existing URL/query flow
→ existing /api/policy-terms endpoint performs server-side search
```

### Phase 9A: Architecture and safety design
- Define backend endpoint shape
- Define request/response JSON contract
- Define validation rules
- Define fallback behavior
- Document what AI is allowed and not allowed to do

### Phase 9B: Backend AI parse endpoint
- Add endpoint such as `/api/assistant/policy-search-parse`
- Accept user prompt
- Call AI provider only from backend
- Return structured filters
- Validate fields before returning them to frontend
- Keep existing `/api/policy-terms` endpoint as the execution layer

### Phase 9B completion notes (current step)
- Added backend assistant parse endpoint skeleton at `/api/assistant/policy-search-parse`.
- Endpoint currently uses deterministic backend parsing only (no external AI provider integration yet).
- Added request/response contract and backend validation for prompt + normalized filter output fields.
- Existing `/api/policy-terms` endpoint remains unchanged as the execution/search layer.
- Real AI provider integration is deferred to a later Phase 9 step.

### Phase 9C: Frontend integration
- AI drawer calls backend assistant endpoint
- Preview parsed filters
- User applies filters
- URL query params update as today
- Existing server-side filtering remains unchanged

### Phase 9D: Fallback and safety
- If AI call fails, use deterministic parser fallback
- If AI returns invalid JSON, show a clear error
- If AI returns unsupported `state`/`status`/`date_field`, reject or normalize safely
- Never allow AI to create arbitrary database queries
- Never send sensitive production data in this prototype

### Phase 9E: Future enterprise considerations
- Environment variable for API key
- No API key committed to repo
- Logging without sensitive prompt data
- Model/provider abstraction
- Auditability
- Human review for production use

### Phase 9 note
The current deterministic parser should remain in place as a safe fallback even after AI-backed parsing is added.
