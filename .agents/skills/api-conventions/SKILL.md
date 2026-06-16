---
name: api-conventions
description: Use when creating or updating src/api request functions, direct module imports, query/mutation separation, and HTTP transport choices.
---

# API Conventions

## Scope

Applies to `src/api/**`.

## Domain Structure

Each domain follows:

```text
src/api/<domain>/
  types/
  query/      # optional
  mutation/   # optional
```

Rules:

1. `types/` is required, with named files such as `get-server-time-result.ts`.
2. Create `query/` only when read/fetch functions exist.
3. Create `mutation/` only when write/side-effect functions exist.
4. Do not create empty folders just to satisfy a template.
5. Do not create or update `index.ts` barrel exports.
6. Import API functions and contracts from concrete files, not folder paths.

## Hard Request Rules

All request functions must use wrapped ky helpers from `@/lib/http/ky`:

1. Use `apiRequest` for endpoints under `src/app/api/**`.
2. Use `httpRequest` for non-`src/app/api/**` endpoints.
3. Do not use direct `fetch`, raw `ky`, or ad-hoc transport logic.

## Client Boundary Rule

Client components must not call API endpoints directly.

Required chain:

`Client Component -> src/hooks -> src/api -> apiRequest/httpRequest`

## Workflow

1. Add function under `query/` or `mutation/` by behavior.
2. Add/update shared contracts under named files in `types/`.
3. Update consumers to import from the concrete function/type file.
4. Ensure transport helper choice is correct (`apiRequest` vs `httpRequest`).

## Review Checklist

- Function is in correct `query` or `mutation` folder.
- Shared contracts exist in named files under `types`.
- No empty `query/` or `mutation/` folders were added.
- No `index.ts` barrel exports or folder-level API imports were added.
- `apiRequest` is used for Next route handlers; `httpRequest` for others.
- No direct client-side API requests are introduced.

## References

- `src/api/README.md`
- `src/hooks/README.md`
- `src/lib/README.md`
