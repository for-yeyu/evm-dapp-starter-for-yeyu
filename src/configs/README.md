# Configs Guide

This directory contains domain runtime config and build-time environment validation.

Goals:

- Keep zod out of application runtime imports.
- Group application identity and wallet provider metadata in `app.ts`.
- Split other EVM dapp config by domain.
- Validate env values before the app is bundled.
- Add server-only config only when a real secret is required.

## Directory Layout

```text
src/configs/
  validator/
    app.ts           # zod validation for app and wallet provider env
    environment.ts   # zod validation for environment env
    index.ts         # validation entry called by next.config.ts
  app.ts             # public app identity and wallet provider config
  environment.ts     # public environment config and type
  chains.ts          # public EVM chain config
```

## Configuration Sources

Not every config value needs to come from `.env`.

- Code-defined config is valid. For example, `chains.ts` defines chain metadata and supported-chain
  lists directly in code; only the environment selector comes from environment config.
- Use environment variables when deployment requirements or secrets call for them, not simply
  because a value is configuration. Validate env-sourced values before exposing them at runtime.

Choose the source based on the actual feature and deployment requirements. Do not automatically
move code-defined config into `.env`. If the choice is unclear, ask the developer before implementing it.

## Validation

Zod validation lives only in `src/configs/validator/**`.

`next.config.ts` should call `validateConfigEnv()` from `src/configs/validator`. Do not define
schemas inline there.

For env-sourced config, runtime modules expose already-validated `process.env` values with narrow
TypeScript types. Code-defined config, such as the chain lists in `chains.ts`, stays directly in
the matching domain module and does not require env validation. Do not import `zod` or validator
modules from runtime config.

## Import Rules

```ts
import { appConfig } from '@/configs/app'
import { chainConfig } from '@/configs/chains'
import { environmentConfig } from '@/configs/environment'
```

The template does not ship an empty server config module. When a feature needs a server secret,
create `src/configs/validator/server.ts` and `src/configs/server.ts`, import `server-only` from the
runtime module, and call the validator from `validateConfigEnv()`. Never expose secrets through
route responses or client props.

## How To Add Env Values

1. Add the value to the matching zod schema in `src/configs/validator/<domain>.ts`.
2. Make sure `validateConfigEnv()` calls that validator.
3. Add the typed value to the matching runtime config module.
4. Consume public values through the specific domain module.
5. Create server config files only when a real server-only value is introduced.

Public example:

```ts
// src/configs/validator/app.ts
const appEnvSchema = z.object({
  NEXT_PUBLIC_FEATURE_FLAG: z.enum(['on', 'off']),
})
```

```ts
// src/configs/app.ts
export const appConfig = {
  featureFlag: process.env.NEXT_PUBLIC_FEATURE_FLAG as 'on' | 'off',
}
```

Server-only example (add these modules only when a feature needs a secret):

```ts
// src/configs/validator/server.ts
const serverEnvSchema = z.object({
  API_SECRET: z.string().trim().min(1, 'API_SECRET is required'),
})
```

```ts
// src/configs/server.ts
import 'server-only'

export const serverConfig = {
  apiSecret: process.env.API_SECRET as string,
}
```

## Chain And Contract Config

For dapp features, keep chain lists/RPC metadata in `chains.ts`, typed per-chain contract addresses
in a feature-specific config module, and ABI assets in `src/lib/abis`. Never silently substitute an
address or another network when a deployment is missing. Public browser RPC URLs cannot contain
secrets.

## Testing

Environment validators are tested as plain functions in the same module directory:

```text
src/configs/validator/
  app.ts
  environment.ts
  test/
    app.test.ts
    environment.test.ts
```

Cover valid values and each meaningful validation boundary, including missing, blank, and invalid
environment values. Isolate environment changes between tests and assert validation errors through
the validator's public behavior.

## Checklist For PRs

- Config sources are chosen deliberately; unclear choices are confirmed with the developer.
- Zod imports stay in `src/configs/validator/**`.
- `next.config.ts` calls `validateConfigEnv()`.
- App identity and wallet provider values stay in `app.ts`.
- Other runtime config stays split by domain.
- Public env values use `NEXT_PUBLIC_*`.
- Empty server config modules are not added.
- Client components never import server-only config.
- Validator tests are colocated under `src/configs/validator/test`.
