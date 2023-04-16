export type Result<L, R> = { type: 'failure'; value: L } | { type: 'success'; value: R }
export const resultSuccess = <T>(value: T): Result<never, T> => ({ type: 'success', value })
export const resultFailure = <T>(value: T): Result<T, never> => ({ type: 'failure', value })
