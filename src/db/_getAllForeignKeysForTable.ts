import BetterSqlite3 from 'better-sqlite3'

// prettier-ignore
type SqlFKDef = {
    id       : 0,
    seq      : 0,
    table    : string // 'step',
    from     : string // 'stepID',
    to       : string // 'id',
    on_update: string // 'NO ACTION',
    on_delete: string // 'NO ACTION',
    match    : string // 'NONE'
  }

export const _getAllForeignKeysForTable = (
    //
    db: BetterSqlite3.Database,
    tableName: string,
) => {
    const stmt = db.prepare(`pragma foreign_key_list(${tableName})`)
    const cols = stmt.all() as SqlFKDef[]
    return cols
}
