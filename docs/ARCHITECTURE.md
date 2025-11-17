# Architecture Guidelines — Ribbony

## Purpose
Document high-level architecture decisions and module responsibilities to keep SOLID design and separation of concerns.

## Principles
- **S**ingle Responsibility: modules/classes must have one reason to change.
- **O**pen/Closed: extend behavior via interfaces, avoid modifying existing classes.
- **L**iskov Substitution: subtypes must be usable where base types are expected.
- **I**nterface Segregation: prefer small interfaces over fat ones.
- **D**ependency Inversion: depend on abstractions (interfaces), not concretes.

## Module Responsibilities (short)
- `auth` — auth, JWT, user management only.
- `product` — CRUD for product entities and specs.
- `customizer` — validation & business rules for magazine payload.
- `order` — pricing, deposit/shipping rules, order lifecycle.

## Dependency rule
Modules should only depend on `shared` + lower layer modules. No cyclic dependencies.

## How to add a new module
1. Create `module` package with `controller/service/repository`.
2. Register interfaces in `shared` for cross-module contracts.
3. Add ADR in `docs/ADR/` describing intent.
