export type ValidResult<A> = { valid: true; value: A }
export type InvalidResult<B> = { valid: false; error: B }
export type Result<A, B = string> = ValidResult<A> | InvalidResult<B>
export const __OK = <A, B>(value: A): Result<A, B> => ({ valid: true, value })
export const __ERROR = <A, B>(error: B): Result<A, B> => ({ valid: false, error })
