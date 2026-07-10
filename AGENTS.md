# Agent Instructions

## Command Restrictions

- Do not run `dev`, `build`, or `lint` commands.
- Do not run `npm` commands.
- Do not run package-manager commands that download dependencies.
- When a dependency is needed, provide the exact `pnpm add` or `pnpm add -D` command for the user to run.
- When removing a dependency, update `package.json` only. Do not edit lockfile dependency removals; the user will run `pnpm i`.

## Code Style

- Do not add local `try`/`catch` blocks or fallback behavior in feature code.
- Use lower camelCase for constants, including module-level constants.
- Do not use `UPPER_SNAKE_CASE` constant names.
- Keep local-only types inline. Do not create named props/types unless they are shared or exported.
- Write `className` inline by default.
- Extract an `xxxClassName` variable only when the exact class list or meaningful shared class pattern is reused in at least 3 places.
- Do not pass unnecessary props through components. Prefer colocated composition, focused child components, hooks, or stores over prop drilling.
- Do not put an entire page implementation in one `index.tsx`; keep route `index.tsx` as a composition entry and split meaningful sections into small kebab-case child components.
- Do not write catch-all hooks that return large bags of functions and state. Split them into smaller hooks by responsibility.
- When app state needs a store, use Zustand. Do not introduce React Context for app stores; reserve providers for third-party/framework providers.

## Project Boundaries

- Keep `src/app` thin and route-focused.
- Put route UI implementation in mirrored `src/ui/app` paths.
- Client components must call APIs through `src/hooks`.
- Hooks call request functions in `src/api`.
- API request functions use `apiRequest` for local `src/app/api/**` endpoints and `httpRequest` for external endpoints.
- Route handlers under `src/app/api/**` use `withResponse`.
- Import from concrete files. Do not add barrel exports.

## Testing

- Use Vitest for function and API tests.
- Place each test in a `test/` directory inside the directory that contains the source file.
- Keep the test filename aligned with the source filename and append `.test.ts`.
- Example: `src/configs/validator/server.ts` maps to `src/configs/validator/test/server.test.ts`.
- Do not create a root-level `test/` directory for source tests.
- Test pure functions, config validators, API request functions, HTTP/error infrastructure, and API route handlers.
- Do not add UI page, component, browser, or `jsdom` tests unless the task explicitly changes this scope.
- Import the concrete source module under test; do not introduce test-only barrel exports.
- Mock external transport and infrastructure boundaries, not the behavior being tested.
- Prefer behavior and public contract assertions over implementation-detail assertions.
- Run `pnpm test` for a one-time run, `pnpm test:watch` for watch mode, and `pnpm test:coverage` for coverage.
- Do not add full test execution to pre-commit until the test suite is large enough to justify the cost; CI is the final test gate.

## Agent Skills

Project-specific agent guidance lives in `.agents/skills`.

Start with `.agents/skills/feature-chain-conventions/SKILL.md` when work crosses multiple layers, then load the layer-specific skill that matches the task:

- `app-router-conventions`
- `ui-conventions`
- `hooks-conventions`
- `api-conventions`
- `configs-conventions`
- `lib-infrastructure-conventions`
- `styles-conventions`
- `project-workflow-conventions`
- `testing-conventions`

## Commit Messages

When the user asks for a commit message, inspect `git status` and `commitlint.config.cjs`, then return one semantic commit command only.

Use an allowed commit type from `commitlint.config.cjs`: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `wip`, `workflow`, `types`, or `release`.

Use a lowercase semantic commit message based on the changed files. If `commitlint.config.cjs` has `useEmoji: true` and `emojiAlign: 'left'`, put the emoji before the type, for example `🎨 style: update formatting`.

Keep the header at or below 108 characters.
