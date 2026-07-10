---
name: lib-infrastructure-conventions
description: Use when modifying src/lib infrastructure modules, request/error/runtime wiring, utility helpers, shared errors, response serialization, transport error behavior, or ABI assets.
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
5. App stores should use Zustand rather than React Context.
6. Do not add `index.ts` barrel exports; import utilities from concrete files when the utility file is not an existing implementation entry.

## Error Behavior

1. Feature code should not add local `try`/`catch` blocks.
2. Do not hide failures with alternate success values.
3. Expected business failures should use the `BaseError` hierarchy.
4. Route handlers should let `withResponse` serialize thrown errors.
5. Request functions should let `apiRequest` and `httpRequest` map transport errors.
6. UI should display hook errors explicitly when the view needs user-facing feedback.

Add a shared error class only when multiple call sites need the same semantics or when transport/response handling depends on its fields.

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
- Errors are not swallowed or converted into successful data.
- Utility changes include tests when regression risk exists.
- No utility barrel exports were added.

## References

- `src/lib/README.md`
- `src/api/README.md`
