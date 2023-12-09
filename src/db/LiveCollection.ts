import type { LiveInstance } from './LiveInstance'

import { makeAutoObservable } from 'mobx'
import { LiveTable } from './LiveTable'
import { DEPENDS_ON } from './LiveHelpers'

export class LiveCollection<L extends LiveInstance<any, any>> {
    constructor(
        public remoteFieldName: () => Partial<L['data']>,
        public remoteTable: () => LiveTable<any, any>,
        public cache?: () => boolean,
    ) {
        makeAutoObservable(this)
    }

    /** debug string for pretty printing */
    // get debugStr() {
    //     return `LiveCollection: ${this.owner.table.name}<<-${this.remoteTable.name}`
    // }

    get items(): L[] {
        const remoteTable = this.remoteTable()
        const shouldCache = this.cache?.() ?? false
        if (!shouldCache) {
            // console.log(`<<< ${remoteTable.name} has size ${remoteTable.liveEntities.size} >>>`)
            DEPENDS_ON(remoteTable.liveEntities.size)
        }
        return remoteTable.find(this.remoteFieldName())
    }

    map = <T>(fn: (l: L) => T): T[] => this.items.map(fn)
}
