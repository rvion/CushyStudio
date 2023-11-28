import { default as BetterSqlite3 } from 'better-sqlite3'

type SqlColDef = {
    cid: number
    name: string
    type: string
    notnull: number
    dflt_value: string
    pk: number
}

export const _getAllColumnsForTable = (
    //
    db: BetterSqlite3.Database,
    tableName: string,
) => {
    const stmt = db.prepare(`pragma table_info(${tableName})`)
    const cols = stmt.all() as SqlColDef[]
    return cols
}
