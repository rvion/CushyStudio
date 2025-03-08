export type ErrorConfigValue<T> = T | { value: T; error: string }

export function extractConfigValue<T>(config?: ErrorConfigValue<T>): T | undefined {
   if (config === undefined || config === null) return undefined

   return Object.prototype.hasOwnProperty.call(config, 'value')
      ? (config as { value: T }).value
      : (config as T)
}

export function extractConfigMessage<T>(
   config: undefined | ErrorConfigValue<T>,
   defaultMessage: string,
): string {
   if (config === undefined || config === null) return defaultMessage

   return Object.prototype.hasOwnProperty.call(config, 'error')
      ? (config as { error: string }).error
      : defaultMessage
}
