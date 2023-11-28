import { default as BetterSqlite3, default as SQL } from 'better-sqlite3'
import { rmSync } from 'fs'
import { _applyAllMigrations } from './_applyAllMigrations'
import { _createRootMig } from './_createRootMig'
import { _checkAllMigrationsHaveDifferentIds } from './migrations'
import { _printSchema } from './_printSchema'

let ix = 0

export class Store {
    log = (...res: any[]) => console.log('🟢', ix++, ...res)

    db: BetterSqlite3.Database

    constructor() {
        const db = SQL('foobar.db', {})
        db.pragma('journal_mode = WAL')
        this.db = db

        _createRootMig(this)
        _checkAllMigrationsHaveDifferentIds()
        _applyAllMigrations(this)
        _printSchema(this)
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
        // const findByID = db.prepare('SELECT * FROM users WHERE id = ?')

        // insert.get('John', 'Doe', 'jdoe@gmail.com', '123456')
        // insert.get('John2', 'Doe2', 'jdoe@gmail.com', '123456')

        // const row: any = findByID.get(1)
        // console.this.log(row.firstName, row.lastName, row.email)
    }
}
