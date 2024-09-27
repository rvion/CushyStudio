import type { BaseInst } from './BaseInst'
import type { LiveTable } from './LiveTable'
import type { TableName } from './TYPES.gen'

export class LiveRef<
    //
    Owner extends BaseInst<any>,
    L extends BaseInst<any>,
> {
    constructor(
        //
        public owner: Owner,
        public key: keyof Owner['data'],
        public tableName: TableName,
    ) {}

    get table(): LiveTable<any, any> {
        return cushy.db[this.tableName] as LiveTable<any, any>
    }

    get id(): L['data']['id'] {
        return (this.owner.data as any)[this.key]
    }

    /** debuging string for pretty printing */
    get debugStr(): string {
        return `LiveRef: ${this.owner.table.name}->${this.table}(${this.id})`
    }

    get item(): L {
        // const db = this.owner.db
        return this.table.getOrThrow(this.id)
    }
}
