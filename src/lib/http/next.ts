import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { BaseError } from '../common/errors/base'

export function withResponse<Args extends unknown[] = unknown[]>(
  handler: (request: NextRequest, ...args: Args) => Promise<unknown> | unknown,
) {
  return async (request: NextRequest, ...args: Args) => {
    try {
      const result = await handler(request, ...args)

      return NextResponse.json(result, { status: 200 })
    } catch (error) {
      if (error instanceof BaseError && !error.needFix) {
        return NextResponse.json(
          { name: error.name, message: error.message, data: error.publicData },
          { status: 400 },
        )
      }

      console.error(error)

      return NextResponse.json(
        { name: 'InternalServerError', message: 'Internal Server Error', data: null },
        { status: 500 },
      )
    }
  }
}
