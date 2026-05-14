# Configs Guide

This directory contains domain runtime config and build-time environment validation.

Goals:
- Keep client-safe values separate from server-only secrets.
- Keep zod out of application runtime imports.
- Split EVM dapp config by domain instead of one broad client/server object.
- Validate env values before the app is bundled.

## Directory Layout

```text
src/configs/
  validator/
    app.ts           # zod validation for app identity env
    environment.ts   # zod validation for environment env
    wallet.ts        # zod validation for wallet provider env
    server.ts        # zod validation for server-only env
    index.ts         # validation entry called by next.config.ts
  app.ts             # public app identity config
  environment.ts     # public environment config and type
  wallet.ts          # public wallet provider config
  chains.ts          # public EVM chain config
  server.ts          # server-only secrets
```

## Validation

Zod validation lives only in `src/configs/validator/**`.

`next.config.ts` should call `validateConfigEnv()` from `src/configs/validator`. Do not define schemas inline there.

Runtime config modules such as `app.ts`, `wallet.ts`, `chains.ts`, and `server.ts` should only expose already-validated values from `process.env` with narrow TypeScript types. Do not import `zod` or validator modules from runtime config.

## Import Rules

Public domain config:

```ts
import { appConfig } from '@/configs/app'
import { chainConfig } from '@/configs/chains'
import { environmentConfig } from '@/configs/environment'
import { walletConfig } from '@/configs/wallet'
```

Server-only values:

```ts
import { serverConfig } from '@/configs/server'
```

`server.ts` must include `import 'server-only'` and must never be imported by client components.

## How To Add Env Values

1. Add the value to the matching zod schema in `src/configs/validator/<domain>.ts`.
2. Make sure `validateConfigEnv()` calls that validator.
3. Add the typed value to the matching runtime config module.
4. Consume public values through the specific domain module.
5. Consume secrets only through `@/configs/server`.

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

Server-only example:

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

## Checklist For PRs

- Zod imports stay in `src/configs/validator/**`.
- `next.config.ts` calls `validateConfigEnv()`.
- Runtime config is split by domain.
- Public env values use `NEXT_PUBLIC_*`.
- Secrets are exported only from `serverConfig`.
- Client components never import `@/configs/server`.
