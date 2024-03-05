import type { TableInfo } from './TYPES_json'
import type { Statement } from 'better-sqlite3'
import type { CompiledQuery } from 'kysely'

// 🔴 WIP
export type Simplify<T> = { [KeyType in keyof T]: Simplify<T[KeyType]> & {} }

// 🔴 WIP
export type Simplify2<T> = { [KeyType in keyof T]: T[KeyType] & {} }

export class LiveSQL<T> {
    stmt: Statement<unknown[]> | null = null //  0 as any // Statement<T[]>
    constructor(
        //
        public table: TableInfo,
        public query: CompiledQuery<T>,
    ) {
        try {
            this.stmt = cushy.db.db.prepare(this.query.sql)
        } catch (e) {
            console.error(`[🤠] SQL`, this.query.sql)
            console.error(`[🤠] SQL ❌ error`, e)
        }
        console.log(`[🤠] `, query.sql, this.query.parameters)
    }

    get all(): T[] {
        if (this.stmt == null) return []
        const x = this.stmt.all(this.query.parameters)
        return x as any[]
    }
}
