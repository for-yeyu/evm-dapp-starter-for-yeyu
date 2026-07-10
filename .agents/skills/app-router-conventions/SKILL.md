---
name: app-router-conventions
description: Use when creating or modifying src/app route entries, page/layout wrappers, framework boundary files, src/app/api/** route handlers, and app-to-ui route mapping.
---

# App Router Conventions

## Scope

Applies to `src/app/**`, including page route entries and `src/app/api/**/route.ts` handlers.

## Page Route Rules

1. Keep `src/app` as a thin route-entry layer.
2. Avoid page UI implementation details in route files.
3. For non-static pages, do not write page-specific styles in `src/app`.
4. Route entries export only `default function Page()` or `default function Layout()`.
5. Route entries return named components imported from mirrored `src/ui/app` paths.

Example:

```tsx
import { ServerTimePage } from '@/ui/app/examples/server-time'

export default function Page() {
  return <ServerTimePage />
}
```

## Folder Mapping Rule

Keep route path and UI path aligned:

```text
src/app/examples/server-time/page.tsx
src/ui/app/examples/server-time/index.tsx
```

## Route Handler Rules

Applies to `src/app/api/**/route.ts`.

1. Route handlers must use `withResponse` from `@/lib/http/next`.
2. Do not return `NextResponse.json` directly from feature route handlers.
3. Do not add local `try`/`catch` blocks in feature route handlers.
4. Do not hide handler errors with alternate success values.
5. Server-only config must be read through `@/configs/server`.
6. Do not put page UI, React hooks, or client component logic in route handlers.
7. Do not call local `src/api` request functions from route handlers to reach the same app.

Prefer a small handler body:

```ts
import { withResponse } from '@/lib/http/next'

export const GET = withResponse(() => {
  return {
    ok: true,
  }
})
```

Add `export const runtime = 'edge'` only when the endpoint is compatible with and benefits from the Edge runtime.

## Workflow

1. Add route entry in `src/app/<route>/page.tsx` or `layout.tsx`.
2. Add/update mirrored UI in `src/ui/app/<route>/index.tsx`.
3. Keep route entry minimal: import + return.
4. Keep shared layout pieces in `src/ui/app/layout` or route-local `layout/`.
5. For API endpoints, add route handlers under `src/app/api/<domain>/<resource>/route.ts`.

## Review Checklist

- Route file uses `Page`/`Layout` export naming.
- Route file returns route-named UI component from `@/ui/app/...`.
- Non-static styles are not introduced in `src/app/**`.
- API handlers are wrapped with `withResponse`.
- Server secrets stay behind `server.ts`.
- `src/app` <-> `src/ui/app` mapping remains one-to-one.

## References

- `src/app/README.md`
- `src/ui/README.md`
