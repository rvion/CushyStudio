// import type { TableInfo } from './TYPES_json'

// import { type LiveDBSubKeys, schemas, type TableName, type TABLES } from './TYPES.gen'

// export class SQL<Table extends TableInfo> {
//     static RAW = <TN extends keyof TABLES>(tableName: TN, builder: (self: SQL<TABLES[TN]>) => void) => {
//         const table = schemas[tableName]
//         const inst = builder(new SQL<TABLES[TN]>('raw', table))
//         return inst
//     }

//     static FROM = <TN extends keyof TABLES>(tableName: TN, builder: (self: SQL<TABLES[TN]>) => void) => {
//         const table = schemas[tableName]
//         const inst = builder(new SQL<TABLES[TN]>('instance', table))
//         return inst
//     }

//     private constructor(
//         //
//         public mode: 'raw' | 'instance',
//         public base: TableInfo,
//     ) {}

//     arguments: any[] = []
//     fields: LiveDBSubKeys[] = []
//     joins: { table: TableName; col1: LiveDBSubKeys; col2: LiveDBSubKeys }[] = []
//     where: { left: string; op: '=' | 'like'; right: any }[] = []
//     get sql() {
//         let out: string = ''
//         out +=
//             `select *` + this.mode === 'raw' //
//                 ? `*`
//                 : this.fields.join(', ')
//         out += `from ${this.base}`
//         for (const join of this.joins) {
//             out += `join ${join.table} on ${join.col1} = ${join.col2}`
//         }
//         return `select * from ${this.base} ${this.joins.join(' ')}`
//     }

//     all() {
//         const query = this.sql
//         const stmt = cushy.db.db.prepare<{ [key: string]: any }>(query)
//         const datas: TABLE['$T'][] = stmt
//             .all(query.parameters)
//             .map((data) => this.infos.hydrateJSONFields_crashOnMissingData(data))
//         const instances = datas.map((d) => this.getOrCreateInstanceForExistingData(d))
//     }
// }
