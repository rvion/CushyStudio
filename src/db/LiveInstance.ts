import type { Maybe } from 'src/utils/types'
import type { LiveDB } from './LiveDB'
import type { LiveTable } from './LiveTable'
import type { STATE } from 'src/front/state'

export interface LiveInstance<T extends { id: string }, L> {
    st: STATE
    db: LiveDB
    table: LiveTable<T, any>
    data: T
    get id(): T['id']
    onCreate?: (data: T) => void
    onUpdate?: (prev: Maybe<T>, next: T) => void
    update: (t: Partial<T>) => void
    delete: () => void
    toJSON: () => T
    init(table: LiveTable<T, any>, data: T): void
    clone(t?: Partial<T>): L
}
