import { LiveTable } from './LiveTable'

export class LiveOrdering {
    constructor(
        //
        table: LiveTable<any, any>,
        column: string,
        order: 'asc' | 'desc',
    ) {}
}
