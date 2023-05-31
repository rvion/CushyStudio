import type { LiveTable } from './LiveTable'
import type { LiveInstance } from './LiveInstance'
import type { TableName } from './LiveStore'

export class LiveCollection<L extends LiveInstance<any, any>> {
    constructor(
        //
        public owner: LiveInstance<any, any>,
        public remoteFieldName: keyof L['data'],
        public remoteTableName: TableName,
    ) {}

    /** debug string for pretty printing */
    get debugStr() {
        return `LiveCollection: ${this.owner.table.name}<<-${this.remoteTableName}`
    }

    get items(): L[] {
        const db = this.owner.db
        const taretTable = (db as any)[this.remoteTableName] as LiveTable<any, any>
        return taretTable.values().filter((l: L) => l.data[this.remoteFieldName] === this.owner.id)
    }

    map = <T>(fn: (l: L) => T): T[] => this.items.map(fn)
}
