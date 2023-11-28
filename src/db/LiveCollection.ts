import type { LiveInstance } from './LiveInstance'
import type { TableName } from './LiveStore'

import { makeAutoObservable } from 'mobx'

export class LiveCollection<L extends LiveInstance<any, any>> {
    constructor(
        //
        public owner: LiveInstance<any, any>,
        public remoteFieldName: keyof L['data'] & string,
        public remoteTableName: TableName,
    ) {
        makeAutoObservable(this)
    }

    /** debug string for pretty printing */
    get debugStr() {
        return `LiveCollection: ${this.owner.table.name}<<-${this.remoteTableName}`
    }

    stmt_items = this.owner.db.prepareAll<{ id: string }, L>(`
        SELECT * FROM ${this.remoteTableName} WHERE ${this.remoteFieldName} = :id
    `)

    get items(): L[] {
        return this.stmt_items({ id: this.owner.id })
    }

    map = <T>(fn: (l: L) => T): T[] => this.items.map(fn)
}
