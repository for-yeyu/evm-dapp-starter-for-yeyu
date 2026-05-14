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
  app.ts           # public app identity config
  environment.ts   # public environment config and type
  wallet.ts        # public wallet provider config
  chains.ts        # public EVM chain config
  server.ts        # server-only secrets
```

- Runtime config is split by domain instead of a broad client/server bucket.
- `server.ts` is the external secret config entry and exports `serverConfig`.

## Hard Rules

1. `validator/` is the only place under `src/configs` that imports `zod`.
2. `next.config.ts` calls the validator entry before exporting config.
3. Runtime config modules read already-validated `process.env` values and narrow them with TypeScript types.
4. Runtime config modules must not import from `validator/`.
5. Client-safe config must be split by domain (`app`, `environment`, `wallet`, `chains`) instead of a single broad client object.
6. Secret config must live in `server.ts` and include `import 'server-only'`.
7. Client components must never import `@/configs/server`.
8. `zod` must not be reachable from client-side imports.

## Workflow

1. Add or update the matching validator module in `validator/<domain>.ts`.
2. Export or call that validator from `validator/index.ts`.
3. Add the typed runtime value to the matching domain config module.
4. Consume public values from their domain module, for example `@/configs/app` or `@/configs/chains`.
5. Consume secrets only from `@/configs/server` in server-only code.
6. If external code needs a config-derived type, export it from the domain module.

## Review Checklist

- Zod imports exist only in `src/configs/validator/**`.
- `next.config.ts` calls the validator entry.
- Runtime config stays split by domain.
- Secret config uses `server-only`.
- No client code imports `@/configs/server`.
- Import boundaries remain explicit and safe.

## References

- `src/configs/README.md`
