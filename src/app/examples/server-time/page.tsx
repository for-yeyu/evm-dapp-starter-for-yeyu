import type { Metadata } from 'next'
import { ServerTimePage } from '@/ui/app/examples/server-time'

export const metadata: Metadata = {
  title: 'server time',
  description: 'View the current server time example.',
}

export default function Page() {
  return <ServerTimePage />
}
