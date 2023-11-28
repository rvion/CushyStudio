import SQL from 'better-sqlite3'
import { migrations } from './migrations'

const db = SQL('foobar.db', {})
db.pragma('journal_mode = WAL')

let ix = 0
const log = (...res: any[]) => console.log('🟢', ix++, ...res)

// ------------------------------------------------------------------------------------
export type Migration = {
    id: string
    name: string
    created_at: string
    sql: string
}
const rootMig = `--sql
    create table if not exists migrations (
        id         text    primary key,
        name       text    not null,
        created_at integer not null,
        sql        text    not null
    );
`
const res = db.prepare(rootMig).run()
log(res)

// check all migrations have different IDS
const ids = new Set()
for (const migration of migrations) {
    if (ids.has(migration.id)) throw new Error(`duplicate migration id: ${migration.id}`)
    ids.add(migration.id)
}

// ------------------------------------------------------------------------------------
// apply all migrations
const executedMigrations: Migration[] = db.prepare('select * from migrations').all() as Migration[]
log(
    `x executedMigrations:`,
    executedMigrations.map((e) => e.name),
)

for (const migration of migrations) {
    const hasRun = executedMigrations.find((m) => m.id === migration.id)
    if (hasRun) {
        log(`🔵 HAS RUN |`, migration.name)
        continue
    } else log(`🔵 MUST RUN |`, migration.name)

    db.transaction(() => {
        const now = Date.now()
        log(`🔵`, migration.id, 'running')

        const stmts = Array.isArray(migration.up) ? migration.up : [migration.up]
        for (const s of stmts) log(db.prepare(s).run())

        log(`🔵`, migration.id, 'saving that it has run')
        const stmt2 = db.prepare(`insert into migrations (id, created_at, name, sql) values (@id, @created_at, @name, @sql)`)
        log(
            stmt2.run({
                id: migration.id,
                name: migration.name,
                created_at: now,
                sql: migration.up,
            }),
        )
    })()
}

const insert = db.prepare('insert into graph ("comfyPromptJSON") values (?)')
insert.run(JSON.stringify({ a: 1 }))
insert.run(JSON.stringify({ a: 2, b: 3 }))
insert.run(JSON.stringify({ a: 2, b: { x: 'coucou' } }))

const getA = db.prepare(`select * from graph where comfyPromptJSON->'$.a' = ?`)
log(getA.all(1))

const getB = db.prepare(`select json_extract(comfyPromptJSON,'$.a') as a from graph`)
log(getB.all())
// const findByID = db.prepare('SELECT * FROM users WHERE id = ?')

// insert.get('John', 'Doe', 'jdoe@gmail.com', '123456')
// insert.get('John2', 'Doe2', 'jdoe@gmail.com', '123456')

// const row: any = findByID.get(1)
// console.log(row.firstName, row.lastName, row.email)
