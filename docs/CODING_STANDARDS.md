# Coding Standards (Java + Frontend)

## Java (Spring Boot)
- Java 17 LTS.
- Package structure: `com.ribbony.<module>.<layer>` (e.g. `com.ribbony.order.service`).
- Layers per module: `controller`, `service`, `port`(interfaces), `adapter`(impl), `repository`, `dto`, `model`.
- Use constructor injection for Spring beans.
- Exceptions: prefer checked for recoverable; runtime for programming errors.
- DTOs for API boundaries. Map using MapStruct or manual mappers in `shared.mapper`.
- Unit tests: JUnit5 + Mockito. Integration tests: SpringBootTest + Testcontainers (optional).
- Use `@Transactional` at service layer boundary only.

## Naming shortcuts
- Service interfaces: `XxxService`, impl: `XxxServiceImpl`.
- Repositories: `XxxRepository` extends `JpaRepository`.
- Controllers: `XxxController` mapped under `/api/<module>`.

## Java formatting/lint
- Use Google Java Format or Checkstyle config in repo.
