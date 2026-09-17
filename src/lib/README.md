# Lib Guide

This directory contains the project’s lowest-level infrastructure modules.

Goals:
- Centralize shared infrastructure primitives (error model, HTTP wrappers, runtime init, web3 state).
- Keep cross-cutting behavior consistent across UI, hooks, and API layers.
- Keep this layer stable and hard to change by default.

## Directory Layout

```text
src/lib/
  abis/                    # Contract ABI files (reserved)
  common/
    errors/                # Base error model and domain errors
    web3/                  # Wagmi config and global EVM state store
  http/                    # HTTP, Next route response, React Query client wrappers
  runtime/                 # Global store/runtime initializers
  utils/                   # Pure utility helpers (formatter/shadcn helpers)
```

## Responsibilities

### `abis/`
- Stores contract ABI assets.
- Use this folder when adding/updating contract interface files.

### `common/errors/`
- Defines base error model (`BaseError`) and typed errors (request/EVM).
- Provides global `errorStore` for unified client-side error handling.
- `BaseError.needFix` is used by HTTP response wrappers to distinguish fix-needed errors.
- `BaseError.data` and `cause` hold internal diagnostics and are never serialized by `withResponse`.
- `BaseError.publicData` contains explicitly client-safe error details, or `null` when omitted.

### `common/web3/`
- Defines `wagmiConfig` and wallet connector setup.
- Defines global EVM store (`evmStore`) and hooks (`useEvmStore`).
- Converts third-party wagmi/viem errors to project-level error classes.

### `http/`
- `ky.ts`: public `apiRequest` and `httpRequest` helpers with unified error conversion.
- `next.ts`: `withResponse` wrapper for Next.js route handlers (`src/app/api/**`).
- `react-query.ts`: shared `queryClient`; QueryCache and MutationCache bridge errors to `errorStore`.

### `runtime/`
- Initializes and wires global runtime behavior (`initializeEvmStore`, `initializeErrorStore`).
- Uses reference counting to prevent duplicated listeners/watchers.

### `utils/`
- Stores reusable pure utilities.
- Current groups:
  - `formatter/`: number/time/text and token amount formatting helpers (with tests).
  - `shadcn/`: `cn` helper for class composition and tailwind conflict merge.

## Modification Policy (Important)

By default, only `utils/` and `abis/` (abi-related assets) should be modified in normal feature work.

Do not modify `src/lib/utils/shadcn/**`; treat it as shadcn support code.

For other directories (`common/`, `http/`, `runtime/`):
- Treat them as foundational infrastructure.
- Do not modify unless there is a clear new business requirement that must change global behavior.
- Any change here should be minimal, explicit, and validated for cross-project impact.

## Usage Rules

1. HTTP API modules use `@/lib/http/ky`; web3 hooks use wagmi/viem, not ky.
2. Next.js route handlers should use `withResponse` for consistent success/error payloads.
3. Client API state should use the shared `queryClient` from `@/lib/http/react-query`.
4. Global runtime bootstrapping should be done through `runtime/` initializer functions.
5. Shared errors should prefer extending `BaseError` for consistent handling and transport.
6. Utilities should avoid `index.ts` barrel exports. Existing `index.ts` files that contain real implementation code are not barrel exports.

## HTTP Error Contract

`withResponse` returns successful handler results as JSON with status `200`.

- Expected `BaseError` failures with `needFix: false` return status `400` and
  `{ name, message, data: publicData }`. Setting `needFix: false` declares that the error name and
  message are safe for clients. Put only explicit public response fields in `publicData`.
- All other failures return status `500` with
  `{ name: 'InternalServerError', message: 'Internal Server Error', data: null }`.
  The original thrown value is logged on the server, not included in the response.
- Never put secrets, upstream responses, or internal diagnostic objects in `publicData`.
  `data` and `cause` remain available for internal debugging regardless of the response.

The transport uses ky 2's pre-parsed `HTTPError.data`; its response body has already been consumed.
`httpRequest` preserves the HTTP status and parsed body in `HttpRequestError`.
`apiRequest` converts only error bodies matching the `{ name: string, message: string, data }`
contract into `ApiRequestError`. Other response shapes remain `HttpRequestError` failures.

`httpRequest` is a supported template API even before any feature calls an external service.
Its `@public` tag keeps this single export out of Knip's unused-export reports, including production
scans. A rule-specific React Doctor directive on the declaration also retains this single public
export for scanners that do not read Knip's tags. The exception applies only to `httpRequest` because
the template supports external APIs without shipping a business consumer. Revisit it if that public
capability is removed. Do not add dummy consumers or ignore the entire HTTP module.

## Testing

Test infrastructure and pure utility behavior without a browser environment. Keep the test beside
the source module:

```text
src/lib/utils/formatter/
  formatters.ts
  test/
    formatters.test.ts
```

Prioritize observable behavior for formatters, error classes, HTTP wrappers, and response helpers.
For HTTP wrapper tests, keep the real ky implementation and replace its `fetch` option with a mock
that returns standard `Response` objects. This covers ky's actual error-data decoding behavior
without network requests. API request-function tests mock the project request-wrapper boundary.
Keep foundational infrastructure tests focused and avoid coupling them to internal local variables.

## How To Add New Code In `lib`

### Add a utility (preferred common change)

1. Add module under `src/lib/utils/<group>/`.
2. Import utilities from concrete files.
3. Add/update tests if logic is non-trivial (see `formatter/test/*.test.ts` pattern).
4. Use from upper layers (`api`, `hooks`, `ui`) through explicit imports.

### Add or update ABI

1. Add ABI file under `src/lib/abis/`.
2. Keep naming explicit and version-aware.
3. Use from API/web3 modules as needed.

### Change infrastructure modules (`common/http/runtime`)

1. Confirm there is a real cross-cutting requirement.
2. Keep scope minimal and backward-compatible where possible.
3. Verify impact on API routes, hooks, providers, and error handling flow.

## Design Principles

1. Infrastructure first: stable contracts over fast local hacks.
2. Single behavior source: one place for request, error, and runtime conventions.
3. Predictable failure handling: map external errors into typed internal errors.
4. Low churn core: avoid frequent changes in foundational folders.
5. Clear layering: business logic should stay in `api/hooks/ui`, not in `lib` core.

## Checklist For PRs

- Change is in `utils/` or `abis/` unless justified by new infra-level requirements.
- `src/lib/utils/shadcn/**` is unchanged.
- HTTP request logic uses `apiRequest`/`httpRequest`; chain RPC and wallet actions use wagmi/viem.
- Route handlers use `withResponse` for response consistency.
- Shared errors use `BaseError` hierarchy when appropriate.
- Utility changes include tests when behavior is complex or easy to regress.
- No utility barrel exports are introduced.
- Non-trivial utility and infrastructure behavior has a colocated `.test.ts` file when coverage is needed.
