import { LiveTable } from './LiveTable'

export interface LiveInstance<T extends { id: string }, L> {
    table: LiveTable<T, any>
    data: T
    get id(): T['id']
    update: (t: Partial<T>) => void
    delete: () => void
    toJSON: () => T
    init(table: LiveTable<T, any>, data: T): void
}
