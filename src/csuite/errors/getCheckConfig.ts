export function getCheckConfig<T>(config?: T | { value: T; error: string }): T | undefined {
   if (config === undefined || config === null) return undefined

   return Object.prototype.hasOwnProperty.call(config, 'value')
      ? (config as { value: T }).value
      : (config as T)
}

export function getCheckError<T>(
   config: undefined | T | { value: T; error: string },
   defaultMessage: string,
): string {
   if (config === undefined || config === null) return defaultMessage

   return Object.prototype.hasOwnProperty.call(config, 'error')
      ? (config as { error: string }).error
      : defaultMessage
}
