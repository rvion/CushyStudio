import type { LiveTable } from './LiveTable'
import type { LiveInstance } from './LiveInstance'
import type { TableName } from './LiveStore'

export class LiveRef<L extends LiveInstance<any, any>> {
    constructor(
        //
        public owner: LiveInstance<any, any>,
        public key: string,
        public tableName: TableName,
    ) {}

    get id(): L['data']['id'] {
        return this.owner.data[this.key]
    }

    /** debug string for pretty printing */
    get debugStr() {
        return `LiveRef: ${this.owner.table.name}->${this.tableName}(${this.id})`
    }

    get item(): L {
        const db = this.owner.db
        const taretTable = (db as any)[this.tableName] as LiveTable<any, any>
        const targetID = this.id
        const targetInst = taretTable.getOrThrow(targetID)
        return targetInst
    }
}
