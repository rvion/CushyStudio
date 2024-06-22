export type SQLITE_boolean = Branded<number, { SQLITE_boolean: true }>
export type SQLITE_boolean_ = number // 🔶 unsafe

export const SQLITE_true: SQLITE_boolean = 1 as SQLITE_boolean
export const SQLITE_false: SQLITE_boolean = 0 as SQLITE_boolean
