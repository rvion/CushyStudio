import type { TableInfo } from './TYPES_json'

import { makeAutoObservable } from 'mobx'

import { DEPENDS_ON } from './LiveHelpers'
import { LiveTable } from './LiveTable'
import { SqlFindOptions, SQLWhere } from './SQLWhere'

export class LiveCollection<TABLE extends TableInfo> {
    constructor(
        public p: {
            table: () => LiveTable<TABLE>
            where: () => SQLWhere<TABLE['$T']>
            options?: SqlFindOptions
            cache?: Maybe<() => boolean>
        },
    ) {
        makeAutoObservable(this)
    }

    get items(): TABLE['$L'][] {
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

    map = <T>(fn: (l: TABLE['$L']) => T): T[] => this.items.map(fn)

    get length(): number {
        return this.items.length
    }
}
