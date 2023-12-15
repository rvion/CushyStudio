import type { BaseInstanceFields } from './LiveInstance'

export type SqlFindOptions = {
    mode?: 'raw'
    limit?: number
}

export type SqlExpr = { $like: string }

export const isSqlExpr = (x: any): x is SqlExpr =>
    typeof x === 'object' && //
    x != null &&
    '$like' in x

export type SQLWhere<T extends BaseInstanceFields> = Partial<{
    [k in keyof T]: T[k] | SqlExpr
}>
