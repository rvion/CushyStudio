export type Either<L, R> = { type: 'failure'; value: L } | { type: 'success'; value: R }
export const resultSuccess = <T>(value: T): Either<never, T> => ({ type: 'success', value })
export const resultFailure = <T>(value: T): Either<T, never> => ({ type: 'failure', value })

export type ResultFailure = { success: false; message: string; error: unknown; value: undefined }
export type Result<R> = { success: true; value: R } | ResultFailure
export const __OK = <T>(value: T): Result<T> => ({ success: true, value })
export const __FAIL = <T>(message: string, error: unknown): Result<any> => ({
    success: false,
    message,
    error,
    value: undefined,
})
