---
name: configs-conventions
description: Use when adding or updating domain runtime config, server-only config, or build-time env validation in src/configs.
---

# Configs Conventions

## Scope

Applies to `src/configs/**` and to code that consumes runtime config from this layer.

## Structure Rules

```text
src/configs/
  validator/       # zod validation called by next.config.ts only
  app.ts           # public app identity and wallet provider config
  environment.ts   # public environment config and type
  chains.ts        # public EVM chain config
```

- Keep application identity and wallet provider metadata together in `app.ts`.
- Keep other runtime config split by domain instead of a broad client/server bucket.
- Do not add an empty `server.ts`; create it only when a real server secret is required.

## Hard Rules

1. `validator/` is the only place under `src/configs` that imports `zod`.
2. `next.config.ts` calls the validator entry before exporting config.
3. Runtime config modules read already-validated `process.env` values and narrow them with TypeScript types.
4. Runtime config modules must not import from `validator/`.
5. App identity and wallet provider values belong to `app.ts`; other client-safe config stays in its domain module.
6. When required, secret config lives in `server.ts` and includes `import 'server-only'`.
7. Client components must never import `@/configs/server`.
8. `zod` must not be reachable from client-side imports.

## Workflow

1. Add or update the matching validator module in `validator/<domain>.ts`.
2. Export or call that validator from `validator/index.ts`.
3. Add the typed runtime value to the matching domain config module.
4. Consume public values from their domain module, for example `@/configs/app` or `@/configs/chains`.
5. Create and consume `@/configs/server` only when a real server secret is introduced.
6. If external code needs a config-derived type, export it from the domain module.

## Review Checklist

- Zod imports exist only in `src/configs/validator/**`.
- `next.config.ts` calls the validator entry.
- App and wallet provider config remain together.
- Other runtime config stays split by domain.
- Empty server config modules are not present.
- Any secret config uses `server-only` and is not imported by client code.
- Import boundaries remain explicit and safe.

## References

- `src/configs/README.md`
