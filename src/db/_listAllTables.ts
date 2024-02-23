import BetterSqlite3 from 'better-sqlite3'

export const _listAllTables = (store: {
    //
    db: BetterSqlite3.Database
    log: (...res: any[]) => void
}) => {
    const db = store.db
    const stmt = db.prepare(`select name from sqlite_master where type='table'`)
    const tables = stmt.all() as { name: string }[]
    store.log(`found tables ${tables.map((r) => r.name)}`)
}
