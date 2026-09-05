# EVM DApp Starter

A Next.js + React Query + wagmi starter focused on clean layering:
- `app` is route entry only.
- `ui` is page/component implementation.
- `api` contains request functions.
- `hooks` is the only client-facing API call layer.

## Runtime Requirements

- Node.js `>= 20`
- pnpm `>= 9`

## Common Commands

For local maintainers:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm knip
```

Agents should follow `AGENTS.md` command restrictions instead of running project scripts directly.

`knip.json` registers `doctor.config.ts` as a tool entry point and excludes unused export reports
for generated shadcn primitives. Other Knip checks remain enabled for those files.
It also ignores the `server-only` dependency report because Next.js handles that import internally.

## Testing

Vitest covers functions and API behavior only. UI pages, React components, browser behavior, and
`jsdom` are outside the current test scope.

Tests are colocated with the source module in a nested `test/` directory:

```text
src/
  configs/
    validator/
      server.ts
      test/
        server.test.ts
  api/
    time/
      query/
        get-server-time.ts
        test/
          get-server-time.test.ts
```

Keep one test file focused on the matching source module. Use `pnpm test` for a one-time local or
CI run, `pnpm test:watch` while developing, and `pnpm test:coverage` to inspect coverage.

## Architecture Overview

```text
src/
  app/        # Next.js route entries (thin layer)
  ui/         # UI implementation (pages + shared components)
  api/        # Request functions by domain (query/mutation/types)
  hooks/      # Hooks layer (React Query wrappers over src/api)
  configs/    # Domain runtime config and build-time env validation
  lib/        # Infrastructure layer (errors/http/runtime/web3/utils)
  styles/     # Global style entry, shadcn base css, fonts
```

## Core Layering Rules

1. Client page components must not call network requests directly.
2. Client pages/components call hooks in `src/hooks`.
3. Hooks call request functions in `src/api`.
4. `src/api` uses wrapped ky request helpers only:
   - `apiRequest` for `src/app/api/**` endpoints
   - `httpRequest` for external endpoints
5. `src/app` should stay minimal and route-focused; page implementation lives in `src/ui/app`.

## Documentation Index

All project architecture docs:

- `AGENTS.md`: Agent-specific command, code style, and workflow instructions
- `.agents/skills/*/SKILL.md`: Modular agent conventions for project layers
- `.agents/skills/testing-conventions/SKILL.md`: Function and API testing conventions
- `src/app/README.md`: App Router entry-layer conventions
- `src/ui/README.md`: UI structure and component organization
- `src/api/README.md`: API request layer rules
- `src/hooks/README.md`: Hook layer and React Query conventions
- `src/configs/README.md`: Env validation and domain config boundaries
- `src/lib/README.md`: Infrastructure modules and change policy
- `src/styles/README.md`: Style entry and CSS extension rules

## README Scan Result (Project Scope)

Scanned `README.md` files in this repository (excluding `backup` directories):

- `README.md`
- `src/app/README.md`
- `src/ui/README.md`
- `src/api/README.md`
- `src/hooks/README.md`
- `src/configs/README.md`
- `src/lib/README.md`
- `src/styles/README.md`
