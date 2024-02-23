import BetterSqlite3 from 'better-sqlite3'

import { Migration } from './_setupMigrationEngine'
import { migrations } from './migrations'

export const _applyAllMigrations = (store: {
    //
    db: BetterSqlite3.Database
    log: (...res: any[]) => void
}) => {
    const db = store.db
    const executedMigrations: Migration[] = db.prepare('select * from migrations').all() as Migration[]
    // const executedMigrationsNames = executedMigrations.map((e) => e.name)
    // store.log(`x executedMigrations:`, executedMigrationsNames)

    for (const migration of migrations) {
        const hasRun = executedMigrations.find((m) => m.id === migration.id)
        if (hasRun) {
            // store.log(`🔵 HAS RUN |`, migration.name)
            continue
        } else store.log(`🔵 MUST RUN |`, migration.name)

        db.transaction(() => {
            const now = Date.now()
            store.log(`🔵`, migration.id, 'running')

            const stmts = Array.isArray(migration.up) ? migration.up : [migration.up]
            for (const s of stmts) store.log(db.prepare(s).run())

            store.log(`🔵`, migration.id, 'saving that it has run')
            const stmt2 = db.prepare(`insert into migrations (id, createdAt, name, sql) values (@id, @createdAt, @name, @sql)`)
            store.log(
                stmt2.run({
                    id: migration.id,
                    name: migration.name,
                    createdAt: now,
                    sql: stmts.join(';\n'),
                }),
            )
        })()
    }
}
