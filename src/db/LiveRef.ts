import type { LiveTable } from './LiveTable'

export class LiveRef<T extends { id: string }, L> {
    constructor(
        //
        public table: LiveTable<T, any>,
        public id: string,
    ) {}

    get item(): L {
        return this.table.getOrThrow(this.id)
    }
}
