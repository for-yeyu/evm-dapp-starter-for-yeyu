'use client'

import Link from 'next/link'
import { buttonVariants } from '@/ui/shadcn/button'

// biome-ignore lint/suspicious/noShadowRestrictedNames: <ignore~>
export default function Error() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl">Something went wrong!</div>
      <Link className={buttonVariants({ className: 'mt-4' })} href="/">
        Back to home
      </Link>
    </div>
  )
}
