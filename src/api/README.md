# API Guide

This directory stores API request functions by domain.

Goals:
- Keep network request logic centralized in `src/api`.
- Separate read/write behavior with `query` and `mutation`.
- Keep request and response contracts explicit in `types`.
- Re-export each domain through `index.ts` for predictable imports.

## Directory Layout

```text
src/api/
  <domain>/
    mutation/              # Write/update requests and side-effect actions
    query/                 # Read/fetch requests
    types/                 # API params and response types
    index.ts               # Domain barrel export
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

### `index.ts`
- Re-export current domain APIs.
- Keep import paths stable and concise.

## Request Rules

All request functions in `src/api` must use the wrapped `apiRequest` function from `@/lib/http/ky`.

1. Use `apiRequest` for Next.js route handlers under `src/app/api/**`.
2. Do not use direct `fetch`, raw `ky`, or other ad-hoc request approaches inside `src/api`.

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
3. API function performs request through `apiRequest`.

Disallowed in client components:
- Directly calling request methods (`fetch`, `ky`, etc.).
- Bypassing hooks to call remote endpoints in arbitrary ways.

## Import Rules

Prefer domain barrel imports:

```ts
import { getServerTime } from '@/api/time'
import { transferToken, type TransferTokenParams } from '@/api/token'
```

Within one domain, use local barrel exports for consistency:

```ts
export * from './mutation'
export * from './query'
export * from './types'
```

## How To Add A New API Domain

1. Create `src/api/<domain>/query`, `mutation`, `types`.
2. Add request functions under `query`/`mutation`.
3. Define shared contracts in `types`.
4. Add `index.ts` in each subfolder and in the domain root.
5. Use `apiRequest` for `src/app/api/**` endpoints.

## Design Principles

1. Single request layer: all API calls live in `src/api`.
2. Explicit intent: `query` and `mutation` are separated.
3. Typed contracts: params and result types live in `types`.
4. Stable exports: all modules expose barrel `index.ts`.
5. Consistent transport: only the wrapped ky helper is allowed.

## Checklist For PRs

- API functions are placed in `query` or `mutation` correctly.
- Shared contracts are defined in `types`.
- Domain and subfolders expose `index.ts`.
- `src/app/api/**` endpoints use `apiRequest`.
- Client components consume API through hooks, not direct requests.
