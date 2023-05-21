import { LiveDB } from './LiveDB'
import { LiveTable } from './LiveTable'

export interface LiveInstance<T extends { id: string }, L> {
    db: LiveDB
    table: LiveTable<T, any>
    data: T
    get id(): T['id']
    onUpdate?: () => void
    update: (t: Partial<T>) => void
    delete: () => void
    toJSON: () => T
    init(table: LiveTable<T, any>, data: T): void
}
