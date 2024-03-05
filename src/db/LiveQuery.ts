// import type { TableInfo } from './TYPES_json'
// import type { Selectable } from 'kysely'

// import { makeAutoObservable } from 'mobx'

// import { DEPENDS_ON } from './LiveHelpers'
// import { LiveTable } from './LiveTable'

// export class LiveFind<TABLE extends TableInfo> {
//     constructor(
//         public p: {
//             remoteTable: () => LiveTable<TABLE>
//             remoteQuery: () => Partial<Selectable<TABLE>>
//             cache?: () => boolean
//         },
//     ) {
//         makeAutoObservable(this)
//     }

//     get items(): TABLE['$L'][] {
//         const remoteTable = this.p.remoteTable()
//         const shouldCache = this.p.cache?.() ?? false
//         if (!shouldCache) {
//             // console.log(`<<< ${remoteTable.name} has size ${remoteTable.liveEntities.size} >>>`)
//             DEPENDS_ON(remoteTable.liveEntities.size)
//         }
//         return remoteTable.find(this.p.remoteQuery())
//     }

//     map = <T>(fn: (l: TABLE['$L']) => T): T[] => this.items.map(fn)
// }
