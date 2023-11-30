import type { LiveInstance } from './LiveInstance'

import { makeAutoObservable } from 'mobx'
import { LiveTable } from './LiveTable'

export class LiveCollection<L extends LiveInstance<any, any>> {
    constructor(
        //
        public owner: LiveInstance<any, any>,
        public remoteFieldName: keyof L['data'] & string,
        public remoteTable: () => LiveTable<any, any>,
    ) {
        makeAutoObservable(this)
    }

    /** debug string for pretty printing */
    get debugStr() {
        return `LiveCollection: ${this.owner.table.name}<<-${this.remoteTable.name}`
    }

    get items(): L[] {
        const table = this.remoteTable()
        const fn = this.owner.db.prepareAll<{ id: string }, L>(
            table.infos,
            `SELECT * FROM ${table.name} WHERE ${this.remoteFieldName} = :id`,
        )
        return fn({ id: this.owner.id })
    }

    map = <T>(fn: (l: L) => T): T[] => this.items.map(fn)
}
