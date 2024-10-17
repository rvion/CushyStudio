import type { Migration } from './_setupMigrationEngine'
import type BetterSqlite3 from 'better-sqlite3'

import { migrations } from './migrations'

export type MigrationContext = {
    //
    db: BetterSqlite3.Database
    log: (...res: any[]) => void
}

export const _applyAllMigrations = (ctx: MigrationContext): void => {
    const db = ctx.db
    const executedMigrations: Migration[] = db.prepare('select * from migrations').all() as Migration[]
    // const executedMigrationsNames = executedMigrations.map((e) => e.name)
    // store.log(`x executedMigrations:`, executedMigrationsNames)

    for (const migration of migrations) {
        if (migration.skip) continue
        const hasRun = executedMigrations.find((m) => m.id === migration.id)
        if (hasRun) {
            // store.log(`🔵 HAS RUN |`, migration.name)
            continue
        } else ctx.log(`🔵 MUST RUN |`, migration.name)

        db.transaction(() => {
            const now = Date.now()
            ctx.log(`🔵`, migration.id, 'running')

            const actions = Array.isArray(migration.up) ? migration.up : [migration.up]
            for (const action of actions) {
                if (typeof action === 'string') {
                    // action is a raw SQL string
                    ctx.log(db.prepare(action).run())
                } else {
                    // action is a lamda ufnctino
                    action(ctx)
                }
            }

            ctx.log(`🔵`, migration.id, 'saving that it has run')
            const stmt2 = db.prepare(`insert into migrations (id, createdAt, name, sql) values (@id, @createdAt, @name, @sql)`)
            ctx.log(
                stmt2.run({
                    id: migration.id,
                    name: migration.name,
                    createdAt: now,
                    sql: actions.join(';\n'),
                }),
            )
        })()
    }
}
