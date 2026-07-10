# App Router Guide

This directory is the App Router entry layer only.

Goals:
- Keep `src/app` focused on routing and framework entry files.
- Keep page UI implementation inside `src/ui/app`.
- Keep route files simple, predictable, and easy to search.

## Directory Layout

```text
src/app/
  (home)/                 # Route group entries
  examples/               # Route entries for examples
  api/                    # Route handlers
  layout.tsx              # Root layout entry
  error.tsx               # Error boundary entry
  not-found.tsx           # Not-found entry
```

## Responsibilities

### `src/app/*`
- Define route entry points (`page.tsx`, `layout.tsx`, route handlers).
- Keep route files minimal and declarative.
- Prefer wiring imports and composition only.

### `src/ui/app/*`
- Implement page UI and interactions.
- Own most styles, layout details, and view logic.
- Mirror route structure from `src/app` for fast lookup.

## API Route Testing

API route handlers are tested as functions and do not require page rendering:

```text
src/app/api/time/
  route.ts
  test/
    route.test.ts
```

Cover successful responses, known `BaseError` responses, and unexpected error responses through the
handler's public response contract. Keep route tests focused on handler behavior and leave shared
serialization details to tests for `src/lib/http/next.ts`.

## Naming And Export Rules

Route entry components in `src/app` should use the simplest default export shape:

```tsx
export default function Page() {
  return <RouteNamePage />
}
```

or

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RouteNameLayout>{children}</RouteNameLayout>
}
```

Rules:
- Use only `Page` or `Layout` as the exported function name in route files.
- Return a route-named UI component, such as `ServerTimePage`, `TransferPage`, `HomePage`.
- UI component should come from the mirrored path under `src/ui/app`.

Example:

```tsx
// src/app/examples/server-time/page.tsx
import { ServerTimePage } from '@/ui/app/examples/server-time'

export default function Page() {
  return <ServerTimePage />
}
```

## Style Boundary

For non-static pages, do not write page-specific styles directly in `src/app` route files.

Preferred:
- Keep styling in `src/ui/app/**`.
- Keep `src/app/**` focused on routing and framework contracts.

Exception:
- Fully static pages can keep small local styling if needed.

## Mapping Rule: `app` <-> `ui/app`

Keep matching directory names between `src/app` and `src/ui/app`.

```text
src/app/examples/server-time/page.tsx
src/ui/app/examples/server-time/index.tsx
```

This one-to-one naming makes route-to-UI lookup immediate.

## How To Add A New Page Route

1. Create route entry in `src/app/<route>/page.tsx`.
2. Create UI implementation in `src/ui/app/<route>/index.tsx`.
3. Name the UI component as `<RouteName>Page`.
4. In route entry, export `default function Page()` and return `<RouteNamePage />`.
5. Keep route entry free from page-level styling unless the page is fully static.

## Design Principles

1. Thin router layer: routing in `app`, view implementation in `ui/app`.
2. Explicit mapping: route path and UI path should match.
3. Stable conventions: `Page`/`Layout` default exports only.
4. Searchability first: predictable names and mirrored folders.
5. Low coupling: route files should avoid business logic and heavy JSX.

## Checklist For PRs

- New route has both `src/app/**` entry and `src/ui/app/**` UI file.
- Route entry exports `default function Page()` or `default function Layout()`.
- Route entry returns a route-named UI component.
- Non-static page styles are not added in `src/app/**`.
- Imports use mirrored path under `@/ui/app/...` when applicable.
- API route tests are colocated under the matching route directory's `test/` folder.

## Further Reading

For `src/ui` directory rules, read `src/ui/readme.md`.
