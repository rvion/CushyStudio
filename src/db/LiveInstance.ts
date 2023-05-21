import { Maybe } from 'src/utils/types'
import { LiveDB } from './LiveDB'
import { LiveTable } from './LiveTable'

export interface LiveInstance<T extends { id: string }, L> {
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
}
