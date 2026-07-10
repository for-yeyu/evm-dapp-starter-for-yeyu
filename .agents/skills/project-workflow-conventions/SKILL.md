---
name: project-workflow-conventions
description: Use when writing or reviewing project-wide code style, naming, local types, className extraction, imports, component props boundaries, hook shape, Zustand store usage, command restrictions, dependency changes, package scripts, lockfile behavior, or commitlint-compliant semantic commit messages.
---

# Project Workflow Conventions

## Code Style

1. Use lower camelCase for constants, including module-level constants.
2. Do not use `UPPER_SNAKE_CASE` constant names.
3. File names should use kebab-case unless the framework requires a special name.
4. Hooks use `use*` naming.
5. UI component names use PascalCase.
6. Import from concrete files, not folder paths.
7. Do not add `index.ts` barrel exports.
8. Use type-only imports for types.

## Types

1. If a type is not exported or shared, keep it inline at the usage site.
2. Do not create names like `HeaderProps` for one-off local component props.
3. Export shared types only when another file needs to import them.

Example:

```tsx
export const Header = ({ title }: { title: string }) => {
  return <h1>{title}</h1>
}
```

## className

1. Write `className` inline by default.
2. Extract an `xxxClassName` variable only when the exact class list or a meaningful shared class pattern is reused in at least 3 places.
3. Do not extract one-off class strings for neatness alone.
4. Use existing `cn`/`cva` helpers only when conditional variants or composition justify them.

## Control Flow

1. Do not add local `try`/`catch` blocks in feature code.
2. Do not add alternate success values to mask failures.
3. Prefer direct returns and small functions.
4. Keep request, cache, and response behavior in their assigned layers.

## Component And Hook Boundaries

1. Do not pass unnecessary props through components.
2. Avoid prop drilling; prefer focused composition, smaller child components, colocated hooks, or a store.
3. Do not put an entire page implementation in one route `index.tsx`.
4. Split meaningful page sections into small kebab-case child files.
5. Do not write hooks that return large bags of unrelated functions and state.
6. Split broad hooks into smaller hooks by responsibility.

## Store Policy

1. Use Zustand when app state needs a store.
2. Do not introduce React Context for app stores.
3. Keep React providers for third-party/framework providers and global handlers.

## Command And Dependency Rules

1. Do not run `dev`, `build`, or `lint` commands.
2. Do not run `npm` commands.
3. Do not run package-manager commands that download dependencies.
4. If a new dependency is needed, provide the exact `pnpm add` command for the user to run.
5. If a dev dependency is needed, provide the exact `pnpm add -D` command for the user to run.
6. When removing dependencies, remove them from `package.json` only and do not edit `pnpm-lock.yaml`.

## Commit Messages

When the user asks for a commit message:

1. Inspect `git status`.
2. Inspect `commitlint.config.cjs`.
3. Choose a type allowed by `type-enum`: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `wip`, `workflow`, `types`, or `release`.
4. If `useEmoji: true` and `emojiAlign: 'left'`, put the emoji before the type.
5. Keep the header at or below 108 characters.
6. Return one semantic commit command only.
7. Do not commit unless the user explicitly asks.

Example:

```bash
git commit -m "🪛 chore: update agent skill conventions"
```

## Testing

1. Use Vitest for function and API tests.
2. Place tests in a `test/` directory nested under the source module directory.
3. Match the source basename and append `.test.ts`.
4. Keep tests focused on observable behavior and public contracts.
5. Do not add UI, browser, or `jsdom` tests unless the task explicitly requires them.
6. Mock external dependencies at the narrowest transport or infrastructure boundary.

## Review Checklist

- Constants use lower camelCase.
- Local-only types remain inline.
- `className` variables are only extracted at 3+ reuse points.
- No local error masking was added.
- Components and hooks stay focused instead of becoming broad controllers.
- App stores use Zustand instead of React Context.
- No restricted command or dependency install was run.
- Function and API tests follow colocated `test/` directory rules.
