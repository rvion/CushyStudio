export type Either<L, R> = { success: false; value: L } | { success: true; value: R }
export const resultSuccess = <T>(value: T): Either<never, T> => ({ success: true, value })
export const resultFailure = <T>(value: T): Either<T, never> => ({ success: false, value })

export type ResultFailure = { success: false; message: string; error: unknown; value: undefined }
export type Result<R> = { success: true; value: R } | ResultFailure
export const __OK = <T>(value: T): Result<T> => ({
   success: true,
   value,
})
export const __FAIL = <T>(message: string, error?: unknown): Result<any> => ({
   success: false,
   message,
   error,
   value: undefined,
})
