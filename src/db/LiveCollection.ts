import type { LiveInstance } from './LiveInstance'

import { makeAutoObservable } from 'mobx'

import { DEPENDS_ON } from './LiveHelpers'
import { LiveTable } from './LiveTable'
import { SqlFindOptions, SQLWhere } from './SQLWhere'

export class LiveCollection<L extends LiveInstance<any, any>> {
    constructor(
        public p: {
            table: () => LiveTable<any, any, any>
            where: () => SQLWhere<L['data']>
            options?: SqlFindOptions
            cache?: Maybe<() => boolean>
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
        const whereX = this.p.where()
        if (!shouldCache) {
            // console.log(`<<< ${remoteTable.name} has size ${remoteTable.liveEntities.size} >>>`)
            DEPENDS_ON(remoteTable.liveEntities.size)
            for (const key in whereX) DEPENDS_ON(remoteTable.keyUpdates[key])
        }
        return remoteTable.find(whereX, this.p.options)
    }

    map = <T>(fn: (l: L) => T): T[] => this.items.map(fn)

    get length(): number {
        return this.items.length
    }
}
