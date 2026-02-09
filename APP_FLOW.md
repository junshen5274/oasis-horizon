# App Flow — Oasis Horizon (v1)

## Routes
- /search
  - Search input (keyword + filters)
  - Results table
  - AI drawer entry point for NL search
- /policy/[policyId]
  - Policy summary + sections (risks, coverages, billing snapshot)
  - AI drawer entry point for policy summary

## AI drawer (right drawer)
- Desktop:
  - Drawer slides in from right
  - Should not break layout of main content
- Mobile:
  - Drawer behaves naturally (full-screen overlay is acceptable)
- Drawer modes:
  - "Natural Language Search"
  - "Policy Summary"
