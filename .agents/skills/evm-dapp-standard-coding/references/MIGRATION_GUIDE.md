# Migration Guide (To This Repository Architecture)

This guide explains how to quickly migrate a messy project into the layered architecture used in this repository.  
It is designed for both human developers and AI tools.

Source of truth:
- Root architecture doc: `README.md`
- Layer docs: `src/*/README.md`
- Executable skills: `.agents/skills/*/SKILL.md`

---

## 1. Target Architecture (Required)

```text
src/
  app/        # Route entry layer (thin)
  ui/         # Page and component implementation layer
  api/        # Request function layer (types + query/mutation when needed)
  hooks/      # Client-only calling layer (React Query)
  configs/    # Domain runtime config + build-time env validation
  lib/        # Infrastructure layer (errors/http/runtime/web3/utils)
  styles/     # Global style entry layer
```

Hard boundaries:
1. Client page components must not request APIs directly.
2. Components can call data only through `src/hooks`.
3. `src/hooks` calls `src/api`.
4. `src/api` must use wrapped request functions only:
   - `apiRequest` for `src/app/api/**`
   - `httpRequest` for non-`src/app/api/**`
5. `src/app` is route entry only, not page implementation.

---

## 2. Fast Migration Strategy (Recommended)

Do not rewrite everything at once. Use **vertical-slice migration + dual track**:

1. Build the target structure first, without deleting old logic.
2. Migrate one business slice at a time (one route/page feature).
3. New work must go to the new architecture only.
4. Old code is migration-only (no new features), until fully removed.

Benefits:
- Controlled risk and continuous delivery.
- Small change sets and clearer regression scope.
- Consistent execution for both teams and AI tools.

---

## 3. Pre-Migration Setup (Day 0)

1. Freeze architecture rules: treat `README.md + src/*/README.md + .agents/skills` as the only standard.
2. Create target folders first: `src/app|ui|api|hooks|configs|lib|styles`.
3. Enable quality gates in CI: lint/typecheck/test cannot be skipped.
4. Define no-go zones:
   - No direct client-side API requests.
   - Do not modify `src/lib/common|http|runtime` by default (unless infra-level requirement).
   - Do not manually edit `src/styles/shadcn.css`.

---

## 4. Single Slice Migration SOP (Core Template)

For an old page `legacy/<feature>`, always use this order:

1. Route entry migration (`src/app`)
- Create `src/app/<route>/page.tsx`
- Keep it as a thin wrapper only:
  - `export default function Page() { return <FeaturePage /> }`

2. UI implementation migration (`src/ui/app`)
- Create `src/ui/app/<route>/index.tsx`
- Move page UI, interaction, and child components here
- Use kebab-case for child files (for example `filter-panel.tsx`)

3. Request function migration (`src/api`)
- Create `src/api/<domain>/types/` first
- Create `query/` only when read/fetch functions exist
- Create `mutation/` only when write/side-effect functions exist
- Move request logic out of page/service into `query` or `mutation`
- Do not create empty folders or empty barrel exports
- Import request functions and contracts from concrete files
- Use `@/lib/http/ky` only:
  - `apiRequest` for Next route handlers
  - `httpRequest` for external endpoints

4. Hook wrapper migration (`src/hooks/api`)
- Mirror `src/api/<domain>`: create only the needed `query/` or `mutation/` folders
- Do not create or update `index.ts` barrel exports
- Import hooks from concrete files
- Wrap `src/api` with React Query:
  - `useQuery` for reads
  - `useMutation` for writes
- Pages call hooks only, never request functions directly

5. Config and constants migration (`src/configs`)
- Put zod validation in `validator/`
- Put client-safe config in domain modules such as `app.ts`, `environment.ts`, `wallet.ts`, and `chains.ts`
- Put secrets in `server.ts` with `import 'server-only'`

6. Infrastructure dependency check (`src/lib`)
- Reuse existing infra utilities whenever possible
- Avoid editing `src/lib/common|http|runtime` unless strictly necessary

7. Style migration (`src/styles` + `src/ui`)
- Keep page styles in the corresponding `src/ui` module
- Create dedicated global `.css` files and import from `src/styles/index.css`
- Do not edit `src/styles/shadcn.css`

---

## 5. How AI Tools Should Execute

### 5.1 Skill Entry

Load the global skill first:
- `.agents/skills/evm-dapp-standard-coding/SKILL.md`

Then load layer skill(s) by changed path:
- `src/app/**` -> `app-router-conventions`
- `src/ui/**` -> `ui-conventions`
- `src/api/**` -> `api-conventions`
- `src/hooks/**` -> `hooks-conventions`
- `src/configs/**` -> `configs-conventions`
- `src/lib/**` -> `lib-infrastructure-conventions`
- `src/styles/**` -> `styles-conventions`

### 5.2 Standard Task Prompt For AI

```text
Follow .agents/skills/evm-dapp-standard-coding/SKILL.md.
Changed paths: <fill paths>.
You must enforce all corresponding sub-skill rules and keep layer boundaries intact.
Migration target: move <old module/page> into the app/ui/api/hooks/configs/lib/styles architecture.
Output:
1) actual code changes
2) migration mapping table (old path -> new path)
3) verification results (lint/typecheck/test)
```

---

## 6. Migration Scan Commands (Find Common Issues Fast)

1. Find direct client requests:

```bash
rg -n "fetch\\(|axios\\(|ky\\(" src/ui src/app
```

2. Find pages using APIs without hooks:

```bash
rg -n "@/api/" src/ui src/app
```

3. Find overweight route files (line-count heuristic):

```bash
find src/app -type f \\( -name "page.tsx" -o -name "layout.tsx" \\) -print0 | xargs -0 wc -l | sort -nr
```

4. Find server-config boundary violations:

```bash
rg -n "@/configs/server" src/ui src/hooks
```

---

## 7. Definition Of Done (DoD)

A migrated business slice is complete only if all conditions are met:

1. Route layer is thin and UI is in `src/ui/app`.
2. Request functions are in `src/api` and organized by `types` + needed `query/mutation` folders.
3. Pages use `src/hooks`; no direct client requests exist.
4. Config is split by domain runtime modules and validator modules with correct boundaries.
5. No unnecessary infra-core changes in `src/lib`.
6. Style changes follow `src/styles/index.css` import-entry rules.
7. `pnpm lint`, `pnpm typecheck`, and required tests pass.

---

## 8. Common Failure Modes And Fixes

1. Failure: business logic inside `src/app/page.tsx`
- Fix: move it to `src/ui/app/<route>/index.tsx`; keep `src/app` as wrapper only.

2. Failure: page directly uses `fetch`/`ky`
- Fix: move request to `src/api`, then expose via `src/hooks`.

3. Failure: `src/api` structure does not match actual behavior (missing needed folder or extra empty folder)
- Fix: keep `types` required, add only needed `query`/`mutation`, and import concrete files directly.

4. Failure: secret config placed in `shared`
- Fix: move to `src/configs/server` and add `server-only`.

5. Failure: arbitrary edits in `src/lib/common|http|runtime`
- Fix: revert to existing infra patterns; change only for explicit infra requirements.

---

## 9. Recommended Migration Order (Best Cost/Benefit)

1. High-traffic pages (highest business impact)
2. Highly reused components (reduce duplicate migration effort)
3. Most chaotic data domains (clean boundaries earlier)
4. Config and infra consolidation (last, lower risk)

---

## 10. References

- `README.md`
- `src/app/README.md`
- `src/ui/README.md`
- `src/api/README.md`
- `src/hooks/README.md`
- `src/configs/README.md`
- `src/lib/README.md`
- `src/styles/README.md`
- `.agents/skills/*/SKILL.md`
