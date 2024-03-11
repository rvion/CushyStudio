// import type { LiveDBSubKeys } from './TYPES.gen'
// import type { TableInfo } from './TYPES_json'
// import type { Statement } from 'better-sqlite3'
// import type { CompiledQuery, SelectQueryBuilder } from 'kysely'

// export type Simplify<T> = { [KeyType in keyof T]: Simplify<T[KeyType]> & {} } // 🔴 WIP
// export type Simplify2<T> = { [KeyType in keyof T]: T[KeyType] & {} } // 🔴 WIP

// export class LiveSQL<T> {
//     stmt: Statement<unknown[]> | null = null //  0 as any // Statement<T[]>
//     query: CompiledQuery<T>
//     constructor(
//         //
//         public table: TableInfo,
//         public qb: SelectQueryBuilder<any, any, T>,
//         public subscriptions: LiveDBSubKeys[] = [],
//     ) {
//         this.query = qb.compile()
//         try {
//             this.stmt = cushy.db.db.prepare(this.query.sql)
//         } catch (e) {
//             console.error(`[🤠] SQL`, this.query.sql)
//             console.error(`[🤠] SQL ❌ error`, e)
//         }
//     }

//     // quick helper to iterate over items
//     map = <R>(f: (t: T) => R): R[] => this.all.map(f)

//     get all(): T[] {
//         // if compiled statement is null, abort and return empty array
//         if (this.stmt == null) return []

//         // make sure this getter will re-run when any of the deps change
//         cushy.db.subscribeToKeys(this.subscriptions)

//         // TIMER start
//         const A = process.hrtime.bigint()

//         // execute the statement
//         const x = this.stmt.all(this.query.parameters)

//         // TIMER end
//         const B = process.hrtime.bigint()
//         const ms = Number(B - A) / 1_000_000
//         console.log(`[⚡️] SQL`, this.query.sql, this.query.parameters, `took`, ms, 'ms')

//         // return the result
//         return x as any[]
//     }
// }
