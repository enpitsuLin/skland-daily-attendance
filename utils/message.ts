import { createSender } from 'statocysts'

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export interface CreateMessageCollectorOptions {
  notificationUrls?: string | string[]
  onError?: () => void
}

export interface CollectOptions {
  output?: boolean // Whether to output to console (default: false)
  isError?: boolean // Whether this is an error message (default: false)
}

export interface MessageCollector {
  // Console output only
  log: (message: string) => void
  error: (message: string) => void

  // Collect message for notification with optional console output
  collect: (message: string, options?: CollectOptions) => void

  push: () => Promise<void>
  hasError: () => boolean
}

export function createMessageCollector(options: CreateMessageCollectorOptions): MessageCollector {
  const messages: string[] = []
  let hasError = false

  const log = (message: string) => {
    console.log(message)
  }

  const error = (message: string) => {
    console.error(message)
    hasError = true
  }

  const collect = (message: string, opts: CollectOptions = {}) => {
    const { output = false, isError = false } = opts

    // Add to notification messages
    messages.push(message)

    // Output to console if requested
    if (output) {
      console[isError ? 'error' : 'log'](message)
    }

    // Mark as error if needed
    if (isError) {
      hasError = true
    }
  }

  const push = async () => {
    const title = '【森空岛每日签到】'
    const content = messages.join('\n\n')
    const urls = options.notificationUrls ? toArray(options.notificationUrls) : []
    const sender = createSender(urls)

    await sender.send(title, content)

    // Exit with error if any error occurred
    if (hasError && options.onError) {
      options.onError()
    }
  }

  return { log, error, collect, push, hasError: () => hasError } as const
}
