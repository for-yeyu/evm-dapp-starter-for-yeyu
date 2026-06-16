import { existsSync } from 'node:fs'
import { readFile, rm, writeFile } from 'node:fs/promises'

const targetPaths = [
  'src/app/examples',
  'src/ui/app/examples',
  'src/app/api/time',
  'src/app/api/configs',
  'src/api/time',
  'src/api/token',
  'src/api/configs',
  'src/hooks/api/time',
  'src/hooks/api/token',
  'src/hooks/api/configs',
  'src/ui/app/(home)/server-config.tsx',
]

const envFilePaths = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.development.local',
  '.env.production',
  '.env.production.local',
  '.env.test',
  '.env.test.local',
]

const envKeys = ['JwtSecret']

const homeServerConfigImport = "import { ServerConfig } from '@/ui/app/(home)/server-config'\n"

const homeExampleLinksBlock = `      <div className="mt-3 flex flex-col space-y-2">
        <Link className="text-primary" href="/examples/transfer">
          Example: Transfer
        </Link>
        <Link className="text-primary" href="/examples/server-time">
          Example: Server Time
        </Link>
      </div>`

const serverConfigContent = `import 'server-only'

export const serverConfig = {}
`

const serverEnvValidatorContent = `import { z } from 'zod'

const serverEnvSchema = z.object({})

export const validateServerEnv = () => {
  serverEnvSchema.parse({})
}
`

const removePath = async targetPath => {
  if (existsSync(targetPath)) {
    await rm(targetPath, { recursive: true, force: true })
  }
}

const editTextFile = async (filePath, editContent) => {
  if (!existsSync(filePath)) {
    return
  }

  const originalContent = await readFile(filePath, 'utf8')
  const nextContent = editContent(originalContent)

  if (nextContent !== originalContent) {
    await writeFile(filePath, nextContent, 'utf8')
  }
}

const replaceTextFile = async (filePath, content) => {
  if (existsSync(filePath)) {
    await writeFile(filePath, content, 'utf8')
  }
}

const removeEnvKeys = content => {
  const nextLines = content
    .split(/\r?\n/)
    .filter(line => envKeys.every(envKey => !new RegExp(`^\\s*${envKey}\\s*=`).test(line)))

  return nextLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\s*$/, '\n')
}

const cleanHomePage = content => {
  let nextContent = content
    .replace(homeExampleLinksBlock, '')
    .replace(/^\s*<ServerConfig className="mt-4" \/>\n/m, '')

  if (!nextContent.includes('<Link')) {
    nextContent = nextContent.replace("import Link from 'next/link'\n", '')
  }

  if (!nextContent.includes('<ServerConfig')) {
    nextContent = nextContent.replace(homeServerConfigImport, '')
  }

  return nextContent.replace(/\n\s*\n(\s*<\/div>\n\s*\))/, '\n$1')
}

const cleanAppReadme = content => {
  return content
    .replace('  examples/               # Route entries for examples\n', '')
    .replace(
      '- Return a route-named UI component, such as `ServerTimePage`, `TransferPage`, `HomePage`.\n',
      '- Return a route-named UI component, such as `HomePage`.\n',
    )
    .replace(
      `// src/app/examples/server-time/page.tsx
import { ServerTimePage } from '@/ui/app/examples/server-time'

export default function Page() {
  return <ServerTimePage />
}`,
      `// src/app/profile/page.tsx
import { ProfilePage } from '@/ui/app/profile'

export default function Page() {
  return <ProfilePage />
}`,
    )
    .replace(
      `src/app/examples/server-time/page.tsx
src/ui/app/examples/server-time/index.tsx`,
      `src/app/profile/page.tsx
src/ui/app/profile/index.tsx`,
    )
}

const cleanUiReadme = content => {
  return content
    .replace(
      '- Example: `header` is shared by both `(home)` and `examples`.\n',
      '- Shared layout components used by multiple routes should live under `app/layout/`.\n',
    )
    .replace(
      '- Route-local layout components can also live under a specific route folder, for example `app/examples/layout/`.\n',
      '- Route-local layout components can also live under a specific route folder, for example `app/profile/layout/`.\n',
    )
    .replace(
      `src/app/examples/server-time/page.tsx
src/ui/app/examples/server-time/index.tsx`,
      `src/app/profile/page.tsx
src/ui/app/profile/index.tsx`,
    )
    .replace(
      '3. Prefer explicit component names by role, such as `HomePage`, `ServerTimePage`, `ServerConfig`.\n',
      '3. Prefer explicit component names by role, such as `HomePage` and `ProfilePage`.\n',
    )
    .replace(
      '5. If a layout is shared only inside a route group (for example `examples`), create `layout/` inside that route folder.\n',
      '5. If a layout is shared only inside a route group, create `layout/` inside that route folder.\n',
    )
}

const cleanApiReadme = content => {
  return content
    .replace(
      `export async function getServerTime(): Promise<number> {
  return await apiRequest<number>({ url: 'time' })
}`,
      `export async function getProfile(): Promise<ProfileResult> {
  return await apiRequest<ProfileResult>({ url: 'profile' })
}`,
    )
    .replace(
      `import { getServerTime } from '@/api/time'
import { transferToken, type TransferTokenParams } from '@/api/token'`,
      `import { getProfile } from '@/api/profile'
import { updateProfile, type UpdateProfileParams } from '@/api/profile'`,
    )
}

const cleanHooksReadme = content => {
  return content
    .replace(
      `src/api/token/query/get-balance.ts
src/hooks/api/token/query/use-balance.ts`,
      `src/api/profile/query/get-profile.ts
src/hooks/api/profile/query/use-profile.ts`,
    )
    .replace(
      "import { getServerTime } from '@/api/time'",
      "import { getProfile } from '@/api/profile'",
    )
    .replace('export function useServerTime() {', 'export function useProfile() {')
    .replace("    queryKey: ['server-time'],", "    queryKey: ['profile'],")
    .replace('      return await getServerTime()', '      return await getProfile()')
}

for (const targetPath of targetPaths) {
  await removePath(targetPath)
}

for (const envFilePath of envFilePaths) {
  await editTextFile(envFilePath, removeEnvKeys)
}

await editTextFile('src/ui/app/(home)/index.tsx', cleanHomePage)
await replaceTextFile('src/configs/server.ts', serverConfigContent)
await replaceTextFile('src/configs/validator/server.ts', serverEnvValidatorContent)
await editTextFile('src/app/README.md', cleanAppReadme)
await editTextFile('src/ui/README.md', cleanUiReadme)
await editTextFile('src/api/README.md', cleanApiReadme)
await editTextFile('src/hooks/README.md', cleanHooksReadme)

// biome-ignore lint/suspicious/noConsole: CLI script output.
console.log('Example files and code removed.')
