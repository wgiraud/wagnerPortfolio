# SOLID + Hexagonal Architecture

This project now uses a hexagonal structure for authentication:

- `core/domain`: business concepts and pure rules
- `core/ports`: interfaces used by the core
- `core/application`: use cases (orchestration)
- `infrastructure`: concrete adapters (Web Crypto, static credential source)
- `app.component`: presentation layer only

## Dependency flow

Presentation -> Application -> Ports -> Infrastructure

The core does not depend on framework-specific implementations.

## SOLID mapping

- `S` (Single Responsibility): use case, repository adapter, and crypto adapter each have one job.
- `O` (Open/Closed): new auth sources or hash strategies can be added by creating new adapters.
- `L` (Liskov): adapters honor their port contracts.
- `I` (Interface Segregation): small focused ports (`CredentialPolicyRepositoryPort`, `CredentialDerivationPort`).
- `D` (Dependency Inversion): use case depends on ports, not concrete classes.

## Main files

- `src/app/core/application/use-cases/authenticate-portfolio-owner.use-case.ts`
- `src/app/core/ports/auth/credential-policy-repository.port.ts`
- `src/app/core/ports/security/credential-derivation.port.ts`
- `src/app/infrastructure/auth/static-credential-policy.repository.ts`
- `src/app/infrastructure/security/web-crypto-credential-derivation.adapter.ts`
- `src/app/infrastructure/auth/auth.providers.ts`
