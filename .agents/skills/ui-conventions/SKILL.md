---
name: ui-conventions
description: Use when implementing or refactoring src/ui page modules, shared components, providers, shadcn wrappers, SVG components, route UI mapped from src/app, component composition, props boundaries, or page splitting.
---

# UI Conventions

## Scope

Applies to `src/ui/**`.

## Structure Rules

1. `src/ui/app` mirrors `src/app` route structure.
2. Page implementation entry file is `index.tsx` in each route folder.
3. Internal child files use lowercase kebab-case (for example `profile-details.tsx`).
4. Shared route layout components live in `src/ui/app/layout`.
5. Route-group-local layout components may live in route-local `layout/` folders.
6. Do not create `index.ts` barrel exports for UI modules.
7. Do not put the full page implementation in one `index.tsx`; use it as a composition entry and split meaningful sections into route-local child components.

## Component Authoring Rules

Default component declaration style:

```tsx
export const Loader: FC<ComponentProps<'div'>> = () => {}
```

Hard constraints:

- Except `src/ui/svgs/**`, components should not consume `props`/`className` by default.
- For non-`svgs` components, keep empty parameter signatures unless explicitly required.
- Do not pass props through multiple layers when they are not needed by intermediate components.
- Prefer focused child components, colocated hooks, or a Zustand store over broad prop drilling.
- Treat `src/ui/shadcn/**` as generated/vendor-like primitives; do not modify files in this directory.
- Do not modify `src/lib/utils/shadcn/**`; it supports shadcn primitives.
- Follow `project-workflow-conventions` for local props types and `className` extraction thresholds.

## Workflow

1. Implement real pages under `src/ui/app/<route>/index.tsx`.
2. Keep mapping with `src/app/<route>/page.tsx`.
3. Split page sections into kebab-case route-local files when the page has multiple sections, stateful blocks, or repeated UI patterns.
4. Put shared/global pieces under `components/providers` or `components/shared`.
5. Place modal-specific code under `components/modal`.

## Review Checklist

- Route UI entry files use `index.tsx`.
- Route UI `index.tsx` stays a composition entry instead of containing the whole page.
- Internal file names follow kebab-case.
- Non-`svgs` components avoid `props`/`className` by default.
- Props are passed only where they carry necessary data or behavior.
- `src/ui/shadcn/**` and `src/lib/utils/shadcn/**` files are not modified.
- No UI barrel exports were added.

## References

- `src/ui/README.md`
- `src/app/README.md`
