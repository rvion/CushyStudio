/**
 * Make some keys optional
 * Usage: PartialOmit<{ a: string, b: string }, 'a'> -> { a?: string, b: string }
 */
export type PartialOmit<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type IsEqual<T, S> = [T] extends [S] ? ([S] extends [T] ? true : false) : false
