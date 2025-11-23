# ADR 0001 — Modular Monolith Architecture

## Date
2025-11-18

## Decision
The Ribbony system will use a **Modular Monolith** architecture as the initial implementation.  
Modules are separated logically (auth, product, customizer, order, infra, admin-ui) inside one Spring Boot codebase.

## Reasoning
- Team size: 2 developers
- Timeframe: 2 weeks
- Easy to implement for Software Engineering-2
- Still fulfills all required technologies: Spring Boot, AOP, Docker, REST, DB
- Allows clean separation of responsibility (SOLID)
- Easy to convert into microservices later if needed

## Module Structure
- `auth` — authentication, roles, JWT
- `product` — products, magazine spec
- `customizer` — magazine payload rules, JSONB validation
- `order` — order lifecycle, pricing, status changes
- `infra/shared` — exceptions, DTOs, logging, AOP
- `admin-ui` — admin dashboards/controllers

## Rules
- All API contracts are owned by Architect in `/specs/openapi.yaml`
- Any contract changes require Architect approval + a new ADR
- Every module follows SOLID and the naming/coding rules in `/docs`
- Every PR must map to SRS requirement IDs

## Status
Accepted
