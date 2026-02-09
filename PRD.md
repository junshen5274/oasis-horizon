# PRD — Oasis Horizon (v1)

## Goal
Build a modern, cloud-ready prototype of **Policy Inquiry/Search** for underwriters, including an AI copilot (read-only) for:
- Natural-language query → structured filters
- Policy summary panel

## Target user
- Underwriter (desktop-first, but mobile responsive)

## Key user journeys
1) Search policies via filters or natural language
2) View results grid
3) Open a policy detail page
4) Use AI drawer to:
   - generate filters from natural language
   - summarize the policy (incl. simple billing snapshot)

## Functional requirements (v1)
### Search page
- Search input and basic filters:
  - status
  - state
  - effective date / expiration date range (simple)
  - keyword (policy number or insured name)
- Results table:
  - sortable columns
  - pagination
- Click a result → policy detail page

### Policy detail page
- Display key policy info
- Display simplified risks/coverages sections (minimal shape is fine)
- Display **fake billing fields**:
  - balance_due
  - next_due_date
  - last_payment_date

### AI drawer (right side)
- NL Search:
  - user prompt → AI returns structured filters JSON
  - UI shows the parsed filters and allows the user to apply them
- Policy Summary:
  - AI summarizes fields displayed on policy detail page + billing snapshot
  - Must be grounded in actual data

### Seed data
- Generate ~1,000 policies with realistic variations:
  - multiple statuses
  - different states
  - varying date ranges
  - coverages/risks with simple structure
- Seed process should be repeatable.

## Non-functional requirements
- Read-only system (no write endpoints)
- Clean modern UI, responsive
- Reasonable performance for 1k records
- Basic observability:
  - structured logs
  - health check endpoints
- Simple audit log for AI prompts/responses (v1 acceptable)

## Out of scope (v1)
- Writes / endorsements / rating / claims / billing transactions
- Multi-tenant
- External integrations (SSO, payments, document store)

## Acceptance criteria (demo-ready)
- A 2–3 minute demo can show:
  1) NL query → filters → search results
  2) policy detail view
  3) policy summary via AI drawer
- App runs locally with one command per service (or docker compose).
