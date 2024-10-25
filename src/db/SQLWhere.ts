export type SqlFindOptions = {
    mode?: 'raw'
    limit?: number
    debug?: boolean
}

export type SqlExpr = { $like: string }

export const isSqlExpr = (x: any): x is SqlExpr =>
    typeof x === 'object' && //
    x != null &&
    '$like' in x

export type SQLWhere<T> = Partial<{
    [k in keyof T]: T[k] | SqlExpr
}>
