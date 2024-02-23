import BetterSqlite3, { default as SQL } from 'better-sqlite3'

import { _applyAllMigrations } from './_applyAllMigrations'
import { _codegenORM } from './_codegenORM'
import { _setupMigrationEngine } from './_setupMigrationEngine'
import { DB_RELATIVE_PATH } from './DB_CONFIG'
import { _checkAllMigrationsHaveDifferentIds } from './migrations'

let ix = 0

export class Store {
    log = (...res: any[]) => console.log('🟢', ix++, ...res)

    db: BetterSqlite3.Database

    constructor() {
        const db = SQL(DB_RELATIVE_PATH, {})
        db.pragma('journal_mode = WAL')
        this.db = db

        _setupMigrationEngine(this)
        _checkAllMigrationsHaveDifferentIds()
        _applyAllMigrations(this)
        _codegenORM(this)
    }

    test = () => {
        const insert = this.db.prepare('insert into graph ("comfyPromptJSON") values (?)')
        insert.run(JSON.stringify({ a: 1 }))
        insert.run(JSON.stringify({ a: 2, b: 3 }))
        insert.run(JSON.stringify({ a: 2, b: { x: 'coucou' } }))

        const getA = this.db.prepare(`select * from graph where comfyPromptJSON->'$.a' = ?`)
        this.log(getA.all(1))

        const getB = this.db.prepare(`select json_extract(comfyPromptJSON,'$.a') as a from graph`)
        this.log(getB.all())
    }
}
