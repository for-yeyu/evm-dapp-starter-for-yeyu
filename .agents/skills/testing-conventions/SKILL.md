---
name: testing-conventions
description: Use when creating, updating, or reviewing Vitest tests for functions, API request functions, route handlers, configs, and infrastructure modules.
---

# Testing Conventions

## Scope

Use Vitest for function and API behavior only.

Included:

- Pure functions and formatters.
- Environment validators.
- API request functions in `src/api`.
- API route handlers in `src/app/api`.
- HTTP wrappers, error classes, and response helpers in `src/lib`.

Excluded by default:

- UI pages and React components.
- Browser behavior and end-to-end tests.
- `jsdom`, Testing Library, and visual tests.
- Snapshot tests for page output.

## Test Placement

Place each test in a `test/` directory inside the directory that contains the source module:

```text
src/configs/validator/
  app.ts
  test/
    app.test.ts
```

```text
src/api/profile/query/
  get-profile.ts
  test/
    get-profile.test.ts
```

Rules:

1. Match the source basename and append `.test.ts`.
2. Keep one test file focused on the matching source module.
3. Do not create a root-level `test/` directory for source tests.
4. Do not create test barrel exports or test-only module aliases.
5. Keep test directories next to the code they verify, not in a separate mirrored tree.

## Imports And Mocks

1. Import the concrete source module under test.
2. Use relative imports for the colocated source module, such as `../formatters`.
3. Use project aliases only when importing another source domain.
4. Mock external dependencies at the narrowest boundary.
5. API request tests mock `apiRequest` or `httpRequest`, not the request function under test.
6. HTTP wrapper tests mock transport behavior at `ky`.
7. Assert returned values, thrown errors, request parameters, and response contracts.
8. Do not duplicate implementation logic in test setup.

## Test Style

1. Group related cases with `describe`.
2. Name cases by observable behavior.
3. Prefer direct `expect` assertions over implementation-detail assertions.
4. Cover the normal case and meaningful boundary/error cases.
5. Use isolated environment values for config validator tests.
6. Keep tests deterministic; do not depend on real network requests, current time, or local machine environment.
7. Do not add local `try`/`catch` blocks to tests when Vitest assertions can express the expected failure.

## Workflow

1. Add the nested `test/` directory beside the source module.
2. Add the matching `.test.ts` file.
3. Run the focused test file with `pnpm test -- <test-file>`.
4. Run the full suite with `pnpm test`.
5. Run `pnpm test:coverage` when coverage behavior or shared infrastructure changes.
6. Run `pnpm typecheck` before handing off the change.

Use `pnpm test:watch` when developing interactively.

Do not run `dev`, `build`, or `lint` as part of this testing workflow.

## Review Checklist

- Test is under the source module's nested `test/` directory.
- Test filename matches the source filename.
- Test covers public function or API behavior.
- External transport is mocked at a boundary.
- No UI or browser test dependencies were added.
- No real network, current-time, or machine-environment dependency was introduced.
- Focused tests and typecheck were run when applicable.
