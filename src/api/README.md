# API Guide

This directory stores API request functions by domain.

Goals:
- Keep network request logic centralized in `src/api`.
- Separate read/write behavior with `query` and `mutation`.
- Keep request and response contracts explicit in `types`.
- Import request functions and contracts from concrete files.

## Directory Layout

```text
src/api/
  <domain>/
    mutation/              # Write/update requests and side-effect actions
    query/                 # Read/fetch requests
    types/                 # API params and response types in named files
```

## Responsibilities

### `query/`
- Read-only request functions.
- Typical usage: fetch list/detail/time/config data.

### `mutation/`
- Write/update request functions.
- Typical usage: create/update/delete actions, transaction actions.

### `types/`
- Shared API contracts used by `query`/`mutation` and callers.

## Request Rules

All request functions in `src/api` must use wrapped request helpers from `@/lib/http/ky`.

1. Use `apiRequest` for Next.js route handlers under `src/app/api/**`.
2. Use `httpRequest` for external endpoints.
3. Do not use direct `fetch`, raw `ky`, or other ad-hoc request approaches inside `src/api`.

Examples:

```ts
import { apiRequest } from '@/lib/http/ky'

export async function getServerTime(): Promise<number> {
  return await apiRequest<number>({ url: 'time' })
}
```

## Client Boundary

Client page components must not request server APIs directly.

Allowed flow:
1. Component uses hook from `src/hooks`.
2. Hook calls function from `src/api`.
3. API function performs request through `apiRequest` or `httpRequest`.

Disallowed in client components:
- Directly calling request methods (`fetch`, `ky`, etc.).
- Bypassing hooks to call remote endpoints in arbitrary ways.

## Import Rules

Do not create or use `index.ts` barrel exports in `src/api`.

Use concrete file imports:

```ts
import { getServerTime } from '@/api/time/query/get-server-time'
import { transferToken } from '@/api/token/mutation/transfer-token'
import type { TransferTokenParams } from '@/api/token/types/transfer-token-params'
```

## How To Add A New API Domain

1. Create `src/api/<domain>/query`, `mutation`, `types`.
2. Add request functions under `query`/`mutation`.
3. Define shared contracts in named files under `types`.
4. Import functions and contracts from concrete files.
5. Use `apiRequest` for `src/app/api/**` endpoints.

## Testing

API request functions are tested without rendering UI or starting a server.

Place the test next to the request function:

```text
src/api/time/query/
  get-server-time.ts
  test/
    get-server-time.test.ts
```

Test the request function's public behavior:

- the wrapped transport helper and request URL;
- the returned response value;
- error propagation and conversion at the API boundary.

Mock `apiRequest` or `httpRequest` at the transport boundary. Do not mock the request function
itself or duplicate the implementation inside the test.

## Design Principles

1. Single request layer: all API calls live in `src/api`.
2. Explicit intent: `query` and `mutation` are separated.
3. Typed contracts: params and result types live in named files under `types`.
4. Direct imports: callers import from concrete files instead of folder paths.
5. Consistent transport: only wrapped ky helpers are allowed.

## Checklist For PRs

- API functions are placed in `query` or `mutation` correctly.
- Shared contracts are defined in named files under `types`.
- Imports point to concrete files instead of folder-level `index.ts` barrels.
- `src/app/api/**` endpoints use `apiRequest`.
- External endpoints use `httpRequest`.
- Client components consume API through hooks, not direct requests.
- API tests are colocated in a nested `test/` directory and use matching `.test.ts` filenames.
