import type { LiveInstance } from './LiveInstance'

import { makeAutoObservable } from 'mobx'
import { LiveTable, SqlFindOptions } from './LiveTable'
import { DEPENDS_ON } from './LiveHelpers'

export class LiveCollection<L extends LiveInstance<any, any>> {
    constructor(
        public p: {
            table: () => LiveTable<any, any>
            where: () => Partial<L['data']>
            options?: SqlFindOptions
            cache?: () => boolean
        },
    ) {
        makeAutoObservable(this)
    }

    /** debug string for pretty printing */
    // get debugStr() {
    //     return `LiveCollection: ${this.owner.table.name}<<-${this.remoteTable.name}`
    // }

    get items(): L[] {
        const remoteTable = this.p.table()
        const shouldCache = this.p.cache?.() ?? false
        if (!shouldCache) {
            // console.log(`<<< ${remoteTable.name} has size ${remoteTable.liveEntities.size} >>>`)
            DEPENDS_ON(remoteTable.liveEntities.size)
        }
        return remoteTable.find(this.p.where(), this.p.options)
    }

    map = <T>(fn: (l: L) => T): T[] => this.items.map(fn)

    get length(): number {
        return this.items.length
    }
}
