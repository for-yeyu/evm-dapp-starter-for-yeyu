export type BaseErrorOptions = {
  data?: unknown
  publicData?: unknown
  cause?: Error
  needFix?: boolean
}

export abstract class BaseError extends Error {
  abstract name: string
  data: unknown
  publicData: unknown
  cause: Error | null
  needFix: boolean
  handled = false

  constructor(message: string, options: BaseErrorOptions = {}) {
    super(message)
    this.data = options.data
    this.publicData = options.publicData ?? null
    this.cause = options.cause ?? null
    this.needFix = options.needFix ?? true
  }

  walk(fn?: (error: Error) => boolean): Error | null {
    let current: Error | null = this
    while (current instanceof Error) {
      if (fn == null) {
        if (!(current.cause instanceof Error)) {
          return current
        }
      } else if (fn(current)) {
        return current
      }
      current = current.cause instanceof Error ? current.cause : null
    }
    return null
  }
}
