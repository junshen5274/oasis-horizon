# Roadmap

Oasis Horizon is an early-stage prototype. The roadmap below is intentionally incremental and read-only first. It is meant to guide maintainable open-source progress without implying production readiness.

## Phase 1: Policy Term Inquiry/Search

Goal: provide a useful read-only entry point for searching and reviewing policy terms.

Planned and in-progress work:

- Policy Terms list with pagination and server-side filtering
- Filters for state, status, effective date, expiration date, and text search
- Deterministic synthetic seed data for local demos
- Assistant drawer that translates natural language into validated structured filters
- Clear display of interpreted filters before applying them
- Backend validation and basic tests for search behavior
- Documentation for setup, data model, and demo flows

## Phase 2: Policy Detail View

Goal: make individual policy term records easier to inspect without adding write workflows.

Potential work:

- Expand Policy Term Detail sections for account, policy, billing-like sample fields, and timeline metadata
- Improve loading, empty, and error states
- Add deep links from list rows to detail pages
- Add backend response tests for detail endpoints
- Add UI tests around key detail-page rendering behavior
- Keep summary content grounded only in available fields

## Phase 3: Risk Inquiry

Goal: introduce read-only risk-level inquiry patterns using synthetic data.

Potential work:

- Add sample risk records linked to policy terms
- Create read-only risk list and risk detail endpoints
- Add frontend screens for risk search and risk detail review
- Document the synthetic risk data model
- Avoid proprietary underwriting rules or confidential risk-scoring logic

## Phase 4: Coverage Inquiry

Goal: model coverage inquiry as an inspectable, read-only workflow.

Potential work:

- Add sample coverage records linked to policy terms and risks
- Create coverage inquiry endpoints with input validation
- Add frontend coverage sections and detail views
- Include coverage examples that are generic and synthetic
- Add tests for coverage filtering and response shape

## Phase 5: Workflow/Performance Observability

Goal: make the prototype easier to operate, debug, and evaluate locally.

Potential work:

- Add simple request timing and API health indicators
- Improve logging for local development
- Add lightweight metrics around search latency and result counts
- Document common troubleshooting steps
- Add CI checks for frontend lint/build and backend tests
- Keep observability local and development-focused for v1

## Phase 6: AI Assistant for Developer Support and Legacy-System Explanation

Goal: explore AI assistance that helps developers and reviewers understand modernization patterns without taking write actions.

Potential work:

- Add assistant prompts for explaining policy inquiry screens and API responses
- Add developer-focused explanations of synthetic legacy-to-modern mappings
- Add audit logging for assistant inputs and outputs
- Clearly label AI-generated explanations and summaries
- Add tests and guardrails to prevent unsupported claims
- Keep AI features read-only and grounded in repository data or available fields

## Non-Goals for the Current Prototype

- No production insurance operations
- No customer data
- No proprietary policy, rating, claim, billing, or underwriting logic
- No external carrier, agency, payment, or claims integrations
- No endorsements, binding, rating, claims creation, billing transactions, or payments
