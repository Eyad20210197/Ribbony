# Code Review Checklist

Before approving a PR:

- [ ] Does the change follow SRP & SOLID (check classes do one job)?
- [ ] Are DB schema changes backward compatible?
- [ ] Is new logic covered by unit tests?
- [ ] No hardcoded secrets or credentials?
- [ ] Naming consistent with `NAMING_CONVENTIONS.md`
- [ ] Logging is not noisy and has correct levels
- [ ] No duplicated business logic; reusable code extracted
- [ ] PR description explains intent + testing steps
