import BetterSqlite3 from 'better-sqlite3'

export type SqlColDef = {
    cid: number
    name: string
    type: string
    notnull: number
    dflt_value: Maybe<string>
    pk: number
}

export const _getAllColumnsForTable = (
    //
    db: BetterSqlite3.Database,
    tableName: string,
): SqlColDef[] => {
    const stmt = db.prepare(`pragma table_info(${tableName})`)
    const cols = stmt.all() as SqlColDef[]
    return cols
}
