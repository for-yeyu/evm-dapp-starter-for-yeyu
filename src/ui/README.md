# UI Guide

This directory contains page UI implementations and reusable UI modules.

Goals:
- Keep `src/app` as a thin route-entry layer.
- Keep real page implementation in `src/ui/app`.
- Keep reusable UI grouped by clear intent.

## Directory Layout

```text
src/ui/
  app/                      # UI implementation mapped to src/app routes
    layout/                 # Route-shared layout components (for example: header)
  components/
    providers/              # Providers and global handlers
    shared/                 # Generic shared components
    modal/                  # Modal components
  shadcn/                   # Installed shadcn components (usually do not modify)
  svgs/                     # SVG components
```

## Responsibilities

### `app/`
- Mirrors the route structure in `src/app`.
- Contains real page components used by route entries.
- Route entry component file uses `index.tsx`.
- Internal child component files should use kebab-case names, for example `profile-details.tsx`.

### `app/layout/`
- Stores layout components shared by multiple route groups.
- The root layout mounts the shared `header` for all routes.
- Route-local layout components can also live under a specific route folder when needed.

### `components/providers/`
- Stores providers and global handlers.
- If more provider categories are needed later, create subdirectories with concrete component files.

### `components/shared/`
- Stores normal reusable components when no stricter category is needed.

### `components/modal/`
- Stores modal-related components.

### `shadcn/`
- Stores installed shadcn UI components.
- Treat these as generated/vendor-like primitives and do not modify files in this directory.

`src/lib/utils/shadcn/**` also supports shadcn primitives and should not be modified.

### `svgs/`
- Stores SVG-based components.

## Mapping Rule: `src/app` <-> `src/ui/app`

Keep directory names aligned between route entries and page implementations.

```text
src/app/(home)/page.tsx
src/ui/app/(home)/index.tsx
```

This mapping makes route-to-UI lookup immediate.

## Naming Rules

1. Page route implementation entry file is `index.tsx` under `src/ui/app/**`.
2. Internal child component files use lowercase kebab-case naming.
3. Prefer explicit component names by role, such as `HomePage` and `Header`.

## Component Authoring Rules

Use this component declaration style in `src/ui`:

```tsx
export const Loader: FC<ComponentProps<'div'>> = () => {}
```

Rules:
- Except components in `svgs/`, do not pass or consume `props` and `className` by default.
- For non-`svgs/` components, keep the function parameter empty unless there is a clear project-level reason.
- If custom `props` or `className` behavior is needed, users should implement it explicitly in their own application layer.
- Do not create `index.ts` barrel exports for UI modules.

## How To Add A New Page UI Module

1. Add route entry in `src/app/<route>/page.tsx`.
2. Add UI implementation in `src/ui/app/<route>/index.tsx`.
3. Keep route-to-UI folder mapping consistent.
4. Put route-local supporting components in the same folder using kebab-case filenames.
5. If a layout is shared only inside a route group, create `layout/` inside that route folder.

## Client Data Example

This hypothetical `src/ui/app/profile/profile-details.tsx` component consumes the hook documented in
`src/hooks/README.md`. The template does not include a profile route or component.

```tsx
'use client'

import type { ComponentProps, FC } from 'react'
import { useProfile } from '@/hooks/api/profile/query/use-profile'

export const ProfileDetails: FC<ComponentProps<'div'>> = () => {
  const { data: profile, isPending, isError } = useProfile()

  if (isPending) {
    return <div>Loading profile...</div>
  }

  if (isError) {
    return <div>Unable to load profile.</div>
  }

  return <div>{profile.displayName}</div>
}
```

Keep the route's `index.tsx` as a composition entry that renders focused child components such as
`ProfileDetails`. Request failures still flow through the shared error infrastructure.

## Design Principles

1. Route clarity: `src/app` is entry, `src/ui/app` is implementation.
2. Intent-based grouping: `providers`, `shared`, `modal`, `shadcn`, `svgs`.
3. Predictable search: mirrored folders and stable naming.
4. Reuse first: shared layout and shared components before duplication.
5. Keep primitives stable: avoid unnecessary edits in `shadcn/`.

## Checklist For PRs

- New route UI has `src/ui/app/**/index.tsx`.
- `src/app` and `src/ui/app` paths stay mirrored.
- Child component filenames follow kebab-case.
- Non-`svgs/` components do not introduce `props` or `className` by default.
- Shared or global concerns are placed in `components/providers` or `components/shared`.
- `src/ui/shadcn/**` and `src/lib/utils/shadcn/**` files are not modified.
- No UI barrel exports are added.
