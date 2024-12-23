// import type { STATE } from '../state/state'
// import type { LiveDB } from './LiveDB'
// import type { LiveTable } from './LiveTable'
// import type { TableInfo } from './TYPES_json'
// import type { AnnotationMapEntry } from 'mobx'

export type $OptionalFieldsForUpsert = 'createdAt' | 'updatedAt'

export type $BaseInstanceFields = 'id' | 'createdAt' | 'updatedAt'
export type BaseInstanceFields = {
   id: string
   createdAt: number
   updatedAt: number
}

// export interface LiveInstance<TABLE extends TableInfo> {
//     st: STATE
//     db: LiveDB
//     table: LiveTable<TABLE>
//     data: TABLE['$T']
//     get id(): TABLE['$ID']
//     get createdAt(): number
//     get updatedAt(): number
//     get tableName(): TableNameInDB
//     instObservabilityConfig?: { [key: string]: AnnotationMapEntry }
//     onHydrate?: (/* data: TABLE['$T'] */) => void
//     onCreate?: (/* data: TABLE['$T'] */) => void
//     /** called on both hydrate and update (bad; need to be changed ❌) */
//     onUpdate?: (prev: TABLE['$T'] | null, next: any /* TABLE['$T'] */) => void
//     update: (t: /* Partial< */ TABLE['$Update'] /* > */, opts?: UpdateOptions) => void
//     update_LiveOnly: (t: Partial<TABLE['$T']>) => void
//     delete: () => void
//     toJSON: () => TABLE['$T']
//     init(table: LiveTable<TABLE>, data: TABLE['$T']): void
//     clone(t?: Partial<TABLE['$T']>): TABLE['$L']
//     log(...args: any[]): void
// }

export type UpdateOptions = {
   debug?: boolean
}
