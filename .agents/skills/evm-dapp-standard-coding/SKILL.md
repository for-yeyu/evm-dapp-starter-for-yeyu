---
name: evm-dapp-standard-coding
description: Use for any coding task in this repository to enforce layered architecture across src/app, src/ui, src/api, src/hooks, src/configs, src/lib, and src/styles.
---

# EVM DApp Standard Coding

## When To Use This Skill

Use this skill for any implementation, refactor, or review task in this repository.

## Architecture Contract

1. `src/app` is route-entry only.
2. `src/ui` implements pages and reusable UI.
3. `src/api` owns request functions.
4. `src/hooks` is the only client-facing API call layer.
5. Client components must not request APIs directly.
6. `src/configs` owns domain runtime config and build-time env validation boundaries.
7. `src/lib` is infrastructure and should remain stable.
8. `src/styles` owns global style entry and CSS import wiring.

## Skill Routing

- `src/app/**` -> `app-router-conventions`
- `src/ui/**` -> `ui-conventions`
- `src/api/**` -> `api-conventions`
- `src/hooks/**` -> `hooks-conventions`
- `src/configs/**` -> `configs-conventions`
- `src/lib/**` -> `lib-infrastructure-conventions`
- `src/styles/**` -> `styles-conventions`

## Standard Workflow

1. Identify changed layer(s).
2. Load matching layer skills and apply hard rules.
3. Keep naming/export patterns consistent with conventions.
4. Run checks relevant to the change (`pnpm lint`, `pnpm typecheck`, tests when needed).
5. Verify no layer boundary violations are introduced.

## Global TypeScript And Lint Rules

1. Use `type` for type definitions; do not introduce `interface`.
2. If a type is not exported/reused, keep it inline instead of creating a named type alias.
3. Lint is based on Biome. Treat `pnpm lint` as the Biome check entry.

## Definition Of Done

- Layer boundaries are preserved.
- Import paths and file layout follow conventions.
- No direct client-side network requests are introduced.
- Infra edits outside `src/lib/utils` or `src/lib/abis` are explicitly justified.

## References

- `README.md`
- `src/app/README.md`
- `src/ui/README.md`
- `src/api/README.md`
- `src/hooks/README.md`
- `src/configs/README.md`
- `src/lib/README.md`
- `src/styles/README.md`
- `references/MIGRATION_GUIDE.md` (Detailed migration playbook for humans and AI tools)
