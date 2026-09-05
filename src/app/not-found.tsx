import Link from 'next/link'
import { buttonVariants } from '@/ui/shadcn/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl">Page not found.</div>
      <Link className={buttonVariants({ className: 'mt-4' })} href="/">
        Back to home
      </Link>
    </div>
  )
}
