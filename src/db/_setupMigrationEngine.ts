import BetterSqlite3 from 'better-sqlite3'

export type Migration = {
    id: string
    name: string
    createdAt: string
    sql: string
}

export const _setupMigrationEngine = (store: {
    //
    db: BetterSqlite3.Database
    log: (...res: any[]) => void
}) => {
    const rootMig = `--sql
        create table if not exists migrations (
            id         text    primary key,
            name       text    not null,
            createdAt integer not null,
            sql        text    not null
        );
    `
    const res = store.db.prepare(rootMig).run()
    store.log(res)
}
