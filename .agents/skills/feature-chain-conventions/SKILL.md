---
name: feature-chain-conventions
description: Use when implementing, planning, or reviewing feature work that may span src/app, src/ui, src/hooks, src/api, src/app/api route handlers, src/configs, src/lib, or src/styles; use to decide which project layers and convention skills should be applied.
---

# Feature Chain Conventions

## Purpose

Use this as the navigation skill before touching multiple project layers.

Canonical client data flow:

```text
src/ui/app page/component
-> src/hooks/api query|mutation hook
-> src/api query|mutation request function
-> src/app/api route handler or external service
-> src/lib/http/configs/errors infrastructure
```

Canonical route mapping:

```text
src/app/<route>/page.tsx
-> src/ui/app/<route>/index.tsx
```

## Layer Responsibilities

- `src/app/**`: thin route entries and Next framework files.
- `src/ui/**`: page UI, user interactions, providers, shared UI, SVG components.
- `src/hooks/**`: React hooks; API hooks are the only client-side path to request functions.
- `src/api/**`: typed request functions and API contracts.
- `src/app/api/**`: server route handlers.
- `src/configs/**`: validated runtime config entry points.
- `src/lib/**`: foundational HTTP, error, runtime, web3, and utility code.
- `src/styles/**`: global style entry, font setup, and global CSS.

## Skill Routing

- New page or route entry: use `app-router-conventions` and `ui-conventions`.
- Client data fetching or mutations: use `hooks-conventions` and `api-conventions`.
- Next route handler under `src/app/api`: use `app-router-conventions` and `lib-infrastructure-conventions` when shared error or response behavior changes.
- Env/config changes: use `configs-conventions`.
- Shared utility, error, HTTP, runtime, or web3 changes: use `lib-infrastructure-conventions`.
- Global CSS or fonts: use `styles-conventions`.
- Code shape, naming, className extraction, local type decisions, component props boundaries, hook shape, Zustand store decisions, dependency changes, scripts, and commit-message requests: use `project-workflow-conventions`.

## Workflow

1. Identify the feature surface: page, route handler, hook, request function, config, utility, style, or dependency.
2. Start at the outermost user-facing layer and follow the chain inward only as needed.
3. Keep each layer thin and focused on its responsibility.
4. Preserve mirrored paths between `src/app`, `src/ui/app`, `src/api`, and `src/hooks/api`.
5. Import from concrete files instead of folder paths.
6. Stop at the narrowest layer that satisfies the request.

## Review Checklist

- The feature follows the expected client data flow.
- Route files stay thin and UI remains in `src/ui/app`.
- Client components do not call request functions or route handlers directly.
- Components, hooks, and stores stay split by responsibility.
- Server route handlers use the project response/error conventions.
- Cross-layer changes are intentional and scoped.

