import type { LiveInstance } from './LiveInstance'
import type { LiveTable } from './LiveTable'

export class LiveRef<
    //
    Owner extends LiveInstance<any, any>,
    L extends LiveInstance<any, any>,
> {
    constructor(
        //
        public owner: LiveInstance<any, any>,
        public key: keyof Owner['data'],
        public table: () => LiveTable<any, any, L>,
    ) {}

    get id(): L['data']['id'] {
        return this.owner.data[this.key]
    }

    /** debug string for pretty printing */
    get debugStr() {
        return `LiveRef: ${this.owner.table.name}->${this.table}(${this.id})`
    }

    get item(): L {
        const db = this.owner.db
        return this.table().getOrThrow(this.id)
    }
}
