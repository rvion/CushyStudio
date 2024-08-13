import type { LiveInstance } from './LiveInstance'
import type { LiveTable } from './LiveTable'
import type { TableName } from './TYPES.gen'

export class LiveRef<
    //
    Owner extends LiveInstance<any>,
    L extends LiveInstance<any>,
> {
    constructor(
        //
        public owner: Owner,
        public key: keyof Owner['data'],
        public tableName: TableName,
    ) {}

    get table() {
        return cushy.db[this.tableName] as LiveTable<any>
    }

    get id(): L['data']['id'] {
        return (this.owner.data as any)[this.key]
    }

    /** debug string for pretty printing */
    get debugStr() {
        return `LiveRef: ${this.owner.table.name}->${this.table}(${this.id})`
    }

    get item(): L {
        // const db = this.owner.db
        return this.table.getOrThrow(this.id)
    }
}
