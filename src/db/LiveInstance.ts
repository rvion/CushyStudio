import type { LiveDB } from './LiveDB'
import type { LiveTable } from './LiveTable'
import type { AnnotationMapEntry } from 'mobx'
import type { STATE } from 'src/state/state'

export type $OptionalFieldsForUpsert = 'createdAt' | 'updatedAt'

export type $BaseInstanceFields = 'id' | 'createdAt' | 'updatedAt'
export type BaseInstanceFields = {
    id: string
    createdAt: number
    updatedAt: number
}

export interface LiveInstance<T extends BaseInstanceFields, L> {
    st: STATE
    db: LiveDB
    table: LiveTable<T, any, any>
    data: T
    get id(): T['id']
    get createdAt(): T['createdAt']
    get updatedAt(): T['updatedAt']
    get tableName(): TableNameInDB
    observabilityConfig?: { [key: string]: AnnotationMapEntry }
    onHydrate?: (data: T) => void
    onCreate?: (data: T) => void
    /** called on both hydrate and update (bad; need to be changed ❌) */
    onUpdate?: (prev: Maybe<T>, next: T) => void
    update: (t: Partial<T>, opts?: UpdateOptions) => void
    update_LiveOnly: (t: Partial<T>) => void
    delete: () => void
    toJSON: () => T
    init(table: LiveTable<T, any, any>, data: T): void
    clone(t?: Partial<T>): L
    log(...args: any[]): void
}

export type UpdateOptions = {
    debug?: boolean
}
