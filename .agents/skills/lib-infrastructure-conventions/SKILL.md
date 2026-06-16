---
name: lib-infrastructure-conventions
description: Use when modifying src/lib infrastructure modules, request/error/runtime wiring, utility helpers, or ABI assets.
---

# Lib Infrastructure Conventions

## Scope

Applies to `src/lib/**`.

## Key Directories

- `abis/`: contract ABI assets.
- `common/errors`: error model and typed errors.
- `common/web3`: wagmi config and EVM store.
- `http`: `apiRequest/httpRequest`, `withResponse`, React Query client.
- `runtime`: store/listener initialization.
- `utils`: pure utility helpers.

## Hard Modification Policy

By default, only `src/lib/utils/**` and `src/lib/abis/**` should be modified.

Do not modify `src/lib/utils/shadcn/**`; treat it as shadcn support code.

For `src/lib/common/**`, `src/lib/http/**`, and `src/lib/runtime/**`:

- Treat as foundational infrastructure.
- Change only for explicit new cross-layer business requirements.
- Keep edits minimal and validate broad impact.

## Usage Rules

1. API layer transport should use `@/lib/http/ky` wrappers.
2. Next route handlers should use `withResponse` from `@/lib/http/next`.
3. Shared errors should prefer `BaseError` hierarchy.
4. Runtime initialization should go through `runtime/*` initializers.
5. Do not add `index.ts` barrel exports; import utilities from concrete files when the utility file is not an existing implementation entry.

## Workflow

1. If change is utility-like, prefer `utils/`.
2. If change is ABI-like, use `abis/`.
3. If infra core must change, document reason and verify behavior across API/hooks/ui.
4. Add or update tests for non-trivial utility logic.

## Review Checklist

- Edit location respects modification policy.
- `src/lib/utils/shadcn/**` is unchanged.
- Transport/error/response wiring stays consistent.
- Infra-core changes (if any) are justified and scoped.
- Utility changes include tests when regression risk exists.
- No utility barrel exports were added.

## References

- `src/lib/README.md`
- `src/api/README.md`
