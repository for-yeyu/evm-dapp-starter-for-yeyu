# Hooks Guide

This directory stores application hooks.

Goals:
- Keep HTTP API hooks in `src/hooks/api` and chain/wallet hooks in `src/hooks/web3`.
- Mirror `src/api` structure for fast lookup and maintenance.
- Use React Query for HTTP requests, and wagmi hooks for wallet/chain operations.
- Import hooks from concrete files instead of barrel exports.

## Directory Layout

The template starts with this guide only. Add hooks for real features as needed; the following
structure and `profile` snippets are documentation examples, not preinstalled hooks.

```text
src/hooks/
  web3/                    # Focused wagmi/viem wallet and contract hooks
  api/
    <domain>/
      mutation/            # useMutation hooks
      query/               # useQuery hooks
      types/               # Hook-level types in named files
```

## Responsibilities

### `api/`
- Corresponds to `src/api`.
- Wraps API functions from `src/api` with React Query hooks.

### `web3/`
- Wrap wagmi/viem reads, simulation, wallet actions, writes, and receipt tracking in focused hooks.
- Reuse SDK query/mutation behavior and the shared QueryClient; do not double-wrap wagmi in `useMutation`.
- No `src/api` counterpart is required. The structure mirror applies to HTTP hooks only.
- Keep wallet account/chain checks, transaction snapshots, and receipt confirmation explicit.

### Non-API hooks
- Other normal hooks should be grouped by function and business needs, then stored under `src/hooks`.
- Create hook categories only when real functionality needs them.

### `api/<domain>/query/`
- `useQuery` hooks for read behavior.
- Calls functions from concrete files in `src/api/<domain>/query`.

### `api/<domain>/mutation/`
- `useMutation` hooks for write behavior.
- Calls functions from `src/api/<domain>/mutation`.
- Handles query invalidation/update when needed.

### `api/<domain>/types/`
- Hook-only types (for example, UI-friendly params).
- Can derive from API types when useful.

## Mapping Rule: `src/hooks/api` <-> `src/api`

Keep similar structure between hooks and API modules.

```text
src/api/profile/query/get-profile.ts
src/hooks/api/profile/query/use-profile.ts
```

This mapping ensures API function and hook wrapper can be found immediately.

## Client Usage Rule

In client page components, direct server requests are not allowed.

Required HTTP flow:
1. Component calls hook from `src/hooks`.
2. Hook calls API function from `src/api`.
3. API function executes request with wrapped ky functions.

Not allowed:
- Calling `fetch`, `ky`, or other network methods directly in client components.
- Calling route handlers directly from components without hooks.

## Hook Authoring Rules

1. Query hooks use `useQuery` and stable `queryKey`.
2. Mutation hooks use `useMutation` and invalidate or update related queries when needed.
3. Hook names use `use*` convention.
4. Keep business request logic in `src/api`; hooks should focus on query lifecycle orchestration.
5. Do not create or update `index.ts` barrel exports.

## How To Add A New API Hook

1. Ensure API function exists in `src/api/<domain>/query` or `mutation`.
2. Create corresponding hook in `src/hooks/api/<domain>/query` or `mutation`.
3. Define hook-only helper types in named files under `src/hooks/api/<domain>/types` if needed.
4. Import the hook from its concrete file in client components.
5. Use the hook in client components instead of calling API functions directly.

Example:

```ts
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/api/profile/query/get-profile'

export function useProfile() {
  return useQuery({
    queryKey: ['profile', 'detail'],
    queryFn: async () => {
      return await getProfile()
    },
  })
}
```

## Design Principles

1. Hooks are the client-facing API layer.
2. API modules remain transport-focused; hooks remain state/query-focused.
3. Structure parity with `src/api` is mandatory for HTTP hooks, not web3 hooks.
4. Query key design should be deterministic and domain-scoped.
5. Concrete imports keep module ownership explicit.

## Mutation And Error Feedback

Use `useMutation` for HTTP writes. Call `mutate` from event handlers, expose its pending/error state,
and invalidate/update the affected query keys in `onSuccess`. Keys for account-scoped data must
include the normalized account and, when relevant, `chainId`. Never submit the same action while
pending. Do not treat a wallet transaction hash as HTTP-style completed success.

Both QueryCache and MutationCache forward failures to `errorStore`, including failures consumed
by `mutate`. An unhandled-rejection listener cannot replace the mutation bridge. Default feedback
belongs to the global error handler; hooks must not add a second toast or local `try`/`catch`.

When a form owns specific inline feedback for an HTTP `BaseError`, synchronously mark that same
error instance as `handled` in the hook's `onError` before displaying the local message. The global
handler defers its toast and respects this flag, while retaining diagnostic logging. This applies
to project `BaseError` instances, not raw SDK errors that may be converted to a new error instance.
For wagmi errors, use the global handler and expose transaction/error state without a duplicate toast.

Do not call `mutateAsync` from UI unless the caller has an explicit promise-ownership contract;
ignoring its rejected promise can report an error twice. Do not suppress errors or return fake success.

## Checklist For PRs

- New API function has a corresponding hook when client usage is needed.
- Hook path mirrors API path and domain.
- Query hooks use `useQuery`; mutation hooks use `useMutation`.
- Imports point to concrete hook files instead of folder-level `index.ts` barrels.
- Client components call hooks instead of direct network requests.
- Non-API hooks are organized by clear functional or business categories.
