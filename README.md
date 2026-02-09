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
