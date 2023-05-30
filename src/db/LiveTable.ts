import type { LiveDB } from './LiveDB'
import type { Maybe } from 'src/utils/types'
import type { LiveInstance } from './LiveInstance'

import * as mobx from 'mobx'
import { MERGE_PROTOTYPES } from './LiveHelpers'

export interface LiveEntityClass<T extends { id: string }, L> {
    new (...args: any[]): LiveInstance<T, L> & L
}

export class LiveTable<T extends { id: string }, L extends LiveInstance<T, L>> {
    instances = new Map<string, L>()
    Ktor: LiveEntityClass<T, L>

    /** 🔴 need more */
    delete = (id: string) => {
        this.instances.delete(id)
    }

    // CTOR ---------------------
    constructor(
        //
        public db: LiveDB,
        public name: string,
        public InstanceClass: LiveEntityClass<T, L>,
    ) {
        this.db._tables.push(this)
        mobx.makeObservable(this, { instances: mobx.observable })

        const BaseInstanceClass = class implements LiveInstance<T, T> {
            /** pointer to the liveDB */
            db!: LiveDB

            /** parent table */
            table!: LiveTable<T, any>

            /** instance data */
            data!: T

            /** this must be fired after creation and update */
            onCreate?: (data: T) => void

            onUpdate?: (prev: Maybe<T>, next: T) => void

            get id() { return this.data.id } // prettier-ignore

            update(t: Partial<T>) {
                const prev = JSON.parse(JSON.stringify(this.data))
                Object.assign(this.data, t)
                this.onUpdate?.(prev, this.data)
            }

            delete() {
                this.table.delete(this.data.id)
            }

            toJSON() {
                return this.data
            }

            init(table: LiveTable<T, L>, data: T) {
                this.db = table.db
                this.table = table
                this.data = data
                this.onCreate?.(data)
                this.onUpdate?.(undefined, data)
                mobx.makeAutoObservable(this)
            }
        }

        MERGE_PROTOTYPES(InstanceClass, BaseInstanceClass)
        this.Ktor = InstanceClass

        // Object.defineProperties(this.ctor)
    }

    map = <X>(fn: (l: L, k: L['data']['id']) => X): X[] => {
        return Array.from(this.instances.entries()).map(([k, v]) => fn(v, k))
    }
    clear = () => this.instances.clear()
    ids = () => Array.from(this.instances.keys())
    values = () => Array.from(this.instances.values())
    mapData = <X>(fn: (k: string, t: T) => X): X[] => Array.from(this.instances.entries()).map(([k, v]) => fn(k, v.data))

    get = (id: string) => this.instances.get(id)
    getOrThrow = (id: string) => {
        const val = this.instances.get(id)
        if (val == null) throw new Error(`ERR: ${this.name}(${id}) not found`)
        return val
    }
    getOrCreate = (id: string, def: () => T): L => {
        const val = this.instances.get(id)
        if (val == null) return this.create(def())
        return val
    }
    private _createInstance = (data: T): L => {
        const instance = new this.Ktor()
        instance.init(this, data)
        return instance
    }

    upsert = (data: T): L => {
        const id = data.id
        // this.yjsMap.set(nanoid(), data)
        const prev = this.instances.get(id)
        if (prev) {
            prev.update(data)
            return prev
        } else {
            const instance = this._createInstance(data)
            this.instances.set(id, instance)
            return instance
        }
    }

    create = (data: T): L => {
        const id = data.id
        if (this.instances.has(id)) throw new Error(`ERR: ${this.name}(${id}) already exists`)
        const instance = this._createInstance(data)
        this.instances.set(id, instance)
        return instance
    }

    toJSON = () => {
        return Object.fromEntries(this.instances.entries())
    }
}
