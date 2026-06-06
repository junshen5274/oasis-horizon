# Contributing

Thanks for considering a contribution to Oasis Horizon.

This project is an early-stage open-source prototype for modernizing legacy insurance inquiry workflows. Small, practical contributions are especially helpful: documentation cleanup, tests, UI polish, API validation, seed data clarity, and local developer experience improvements.

## Before You Contribute

Please do not include:

- Proprietary company code
- Customer, policyholder, claim, billing, or production data
- Confidential business logic
- Employer-specific internal workflows
- Secrets, credentials, tokens, or private configuration

All example data and workflows should remain synthetic, generic, and safe for a public repository.

## Local Setup

Prerequisites:

- Node.js 20 or compatible recent LTS
- npm
- Java 17
- Maven
- Docker Desktop or Docker Engine

From the repository root, start local services:

```bash
./scripts/start-postgres.sh
./scripts/start-api.sh
./scripts/start-web.sh
```

Useful local URLs:

- Web: `http://localhost:3000/policy-terms`
- API: `http://localhost:8080/api/policy-terms?size=10`

Manual startup is also supported:

```bash
docker compose up -d
cd api
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

In a separate terminal:

```bash
cd web
npm install
npm run dev
```

## Running Checks

Backend:

```bash
cd api
mvn test
```

Frontend:

```bash
cd web
npm install
npm run lint
npm run build
```

If a check does not run because of local environment limits, please mention that in the pull request.

## Creating Issues

Before opening an issue, please check whether a similar issue already exists.

Good issues include:

- A short title
- A clear description of the problem or improvement
- Steps to reproduce, if reporting a bug
- Expected behavior
- Screenshots or API examples, when useful
- Notes about whether the work is documentation, frontend, backend, database, tests, or AI assistant behavior

Please avoid posting private data, real policy examples, proprietary workflows, or secrets in issues.

## Branches and Pull Requests

Please keep changes small and reviewable.

Suggested branch naming:

- `docs/<short-description>`
- `frontend/<short-description>`
- `backend/<short-description>`
- `test/<short-description>`

Pull requests should include:

- What changed
- Why it changed
- How it was tested
- Any known limitations or follow-up work

Avoid introducing new technologies or major architectural changes without opening an issue for discussion first.

## Coding Style

General expectations:

- Prefer clarity over cleverness.
- Keep the app read-only for the current prototype scope.
- Validate API inputs.
- Keep generated seed data reproducible where practical.
- Add comments when business meaning would otherwise be unclear.
- Use existing project patterns before adding new abstractions.

Frontend expectations:

- Use TypeScript.
- Keep UI behavior accessible and responsive.
- Follow the existing Next.js App Router and Tailwind CSS structure.
- Avoid large visual rewrites in the same PR as unrelated behavior changes.

Backend expectations:

- Use the existing Spring Boot modular monolith structure.
- Keep endpoints read-only.
- Add or update tests for core service and controller behavior when changing API logic.
- Keep database changes in Flyway migrations.

AI assistant expectations:

- AI features must remain read-only.
- Show interpreted structured filters before applying them.
- Summaries and explanations must be grounded in available fields.
- Do not invent policy facts, customer facts, or proprietary insurance logic.
- Audit assistant inputs and outputs where the feature supports it.

## Project Status

Oasis Horizon is not production-ready and is not affiliated with any employer or insurance company. It is a public prototype for exploring maintainable modernization patterns with synthetic data.
