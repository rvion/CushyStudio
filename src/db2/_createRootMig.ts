import { default as BetterSqlite3, default as SQL } from 'better-sqlite3'
import { Store } from './storage'

export type Migration = {
    id: string
    name: string
    createdAt: string
    sql: string
}

export const _createRootMig = (store: {
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
