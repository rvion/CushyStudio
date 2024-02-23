import BetterSqlite3, { default as SQL } from 'better-sqlite3'

import { _getAllColumnsForTable } from './_getAllColumnsForTable'

export const _makeNotNullable = (
    p: {
        db: BetterSqlite3.Database
        log: (...res: any[]) => void
    },
    tableName: string,
    field: string,
) => {
    const db = p.db

    const cols = _getAllColumnsForTable(db, tableName)
    const sqlToRecreateTable = `--sql
        create table ${tableName}_new (
            ${cols.map((c) => {
                return ''
            })}
        )
    `

    // const sqlToRecreateTable = `--sql
    //     create table ${tableName}_new as select * from ${tableName};
    //     drop table ${tableName};
    //     alter table ${tableName}_new rename to ${tableName};
    // `

    return `--sql
        alter table ${tableName} add column ${field} not null default 0;`
}
