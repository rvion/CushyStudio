// import type { KyselyTables, LiveDBSubKeys, TableName, TABLES } from './TYPES.gen'
// import type { TableInfo } from './TYPES_json'
// import type { CompiledQuery, SelectQueryBuilder } from 'kysely'

// import { makeAutoObservable } from 'mobx'

// import { DEPENDS_ON } from './LiveHelpers'
// import { LiveTable } from './LiveTable'
// import { SqlFindOptions } from './SQLWhere'

// export class LiveCollection<TABLE extends TableInfo> {
//     static of = <const T extends TableName>(
//         table: T,
//         query: (x: SelectQueryBuilder<KyselyTables, T, TABLES[T]['$T']>) => SelectQueryBuilder<KyselyTables, T, TABLES[T]['$T']>,
//         subscriptions: LiveDBSubKeys[],
//     ): LiveCollection<TABLES[T]> => {
//         // const table =
//         // const query = fn(this.query1).compile()
//         return new LiveCollection({
//             table: () => cushy.db[table] as LiveTable<TABLES[T]>,
//             query: query.compile(),
//             subscriptions,
//         })
//         //
//     }
//     constructor(
//         public p: {
//             table: () => LiveTable<TABLE>
//             query: (
//                 x: SelectQueryBuilder<KyselyTables, TABLE['$TableName'], TABLE['$T']>,
//             ) => SelectQueryBuilder<KyselyTables, TABLE['$TableName'], TABLE['$T']>
//             // options?: SqlFindOptions
//             cache?: Maybe<() => boolean>
//             subscriptions: LiveDBSubKeys[]
//         },
//     ) {
//         makeAutoObservable(this)
//     }

//     get items(): TABLE['$L'][] {
//         const remoteTable = this.p.table()
//         const shouldCache = this.p.cache?.() ?? false
//         // const whereX = remoteTable.live(this.p.live)
//         if (!shouldCache) {
//             // console.log(`<<< ${remoteTable.name} has size ${remoteTable.liveEntities.size} >>>`)
//             DEPENDS_ON(remoteTable.liveEntities.size)
//             for (const key in whereX) cushy.db.subscribeToKey(`${remoteTable.name}.${key}` as LiveDBSubKeys)
//         }
//         return remoteTable.find(this.p.query, this.p.options)
//     }

//     map = <T>(fn: (l: TABLE['$L']) => T): T[] => this.items.map(fn)

//     get length(): number {
//         return this.items.length
//     }
// }
