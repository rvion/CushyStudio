import type { Indexed, LiveDB } from './LiveDB'
import type { $BaseInstanceFields, BaseInstanceFields, LiveInstance } from './LiveInstance'
import type { TableName } from './LiveStore'

import { MERGE_PROTOTYPES } from './LiveHelpers'
import { STATE } from 'src/front/state'
import { nanoid } from 'nanoid'
import { makeAutoObservable, toJS } from 'mobx'
import { LiveOrdering } from './LiveOrdering'

export interface LiveEntityClass<T extends BaseInstanceFields, L> {
    new (...args: any[]): LiveInstance<T, L> & L
}

export class LiveTable<T extends BaseInstanceFields, L extends LiveInstance<T, L>> {
    private Ktor: LiveEntityClass<T, L>
    private _store: Indexed<T>
    toJSON = (): Indexed<T> => this._store

    find = (check: (l: L) => boolean): Maybe<L> => {
        for (const v of this.values) {
            if (check(v)) return v
        }
        return null
    }
    findOrCrash = (check: (l: L) => boolean): L => {
        for (const v of this.values) {
            if (check(v)) return v
        }
        throw new Error('no entry found')
    }

    /** number of entities in the table */
    get size() { return Object.keys(this._store).length } // prettier-ignore

    /** return first entity from table, or null if table is empty */
    first = (): Maybe<L> => {
        const id0 = this.ids[0]
        if (id0 == null) return null
        return this.getOrThrow(id0)
    }

    /** return first entity from table, or crash if table is empty */
    firstOrCrash = (): L => {
        const id0 = this.ids[0]
        if (id0 == null) throw new Error('collection is empty')
        return this.getOrThrow(id0)
    }

    constructor(
        //
        public db: LiveDB,
        public name: TableName,
        public InstanceClass: LiveEntityClass<T, L>,
    ) {
        // ensure store has a key for this table
        if (!(name in db.store)) db.store[name] = {}
        this._store = (db.store as any)[name] as Indexed<T>

        // register
        this.db._tables.push(this)

        const BaseInstanceClass = class implements LiveInstance<T, T> {
            /** pointer to the liveDB */
            db!: LiveDB

            /** pointer to the global state */
            st!: STATE

            /** parent table */
            table!: LiveTable<T, any>

            /** instance data */
            data!: T

            /** on original creation */
            onCreate?: (data: T) => void

            /** on hydratation */
            onHydrate?: (data: T) => void

            /** this must be fired after hydrate and update */
            onUpdate?: (prev: Maybe<T>, next: T) => void

            get id() { return this.data.id } // prettier-ignore
            get createdAt() { return this.data.createdAt } // prettier-ignore
            get updatedAt() { return this.data.updatedAt } // prettier-ignore

            update(t: Partial<T>) {
                const prev = this.onUpdate ? JSON.parse(JSON.stringify(this.data)) : undefined
                Object.assign(this.data, t)
                this.onUpdate?.(prev, this.data)
            }

            clone(t?: Partial<T>): T {
                const cloneData = Object.assign({}, toJS(this.data), { id: nanoid(), ...t })
                // console.log(`🔴 cloneData:`, cloneData)
                // console.log(`🔴 this.data=`, this.data)
                return this.table.create(cloneData)
            }

            delete() {
                this.table.delete(this.data.id)
            }

            toJSON() {
                return this.data
            }

            init(table: LiveTable<T, L>, data: T) {
                // console.log(`🔴 INIT`, data)
                this.db = table.db
                this.st = table.db.st
                this.table = table
                this.data = data
                this.onHydrate?.(data)
                this.onUpdate?.(undefined, data)
                makeAutoObservable(this)
            }
        }

        // make observable
        makeAutoObservable(this, {
            // @ts-ignore (private properties are untyped in this function)
            Ktor: false,
            store: false,
        })

        MERGE_PROTOTYPES(InstanceClass, BaseInstanceClass)
        this.Ktor = InstanceClass
    }

    // UTILITIES -----------------------------------------------------------------------

    map = <R>(fn: (inst: L, ix: number) => R): R[] => {
        return this.values.map((v, ix) => fn(v, ix))
    }

    clear = () => {
        this.instances.clear()
        for (const k of this.ids) delete this._store[k]
    }

    get ids(): T['id'][] {
        return Object.keys(this._store)
    }
    createdAtDesc = new LiveOrdering(this, 'createdAt', 'desc')

    get values(): L[] {
        return this.ids.map((id) => this.getOrThrow(id))
    }

    // 🔴 meh
    mapData = <R>(fn: (k: T['id'], t: T) => R): R[] => Object.values(this._store).map((data) => fn(data.id, data))

    // UTILITIES -----------------------------------------------------------------------

    get = (id: string): Maybe<L> => {
        // 1. check if instance exists in the entity map
        const val = this.instances.get(id)
        if (val) {
            // console.log(`[${this.name}.get] instance existing`)
            return val
        }

        // 2. check if data exists in the data store
        const store = this.db.store[this.name] ?? {}
        if (store[id]) {
            // console.log(`[${this.name}.get] data found, but no instance => creating instance`)
            return this._createInstance(store[id] as any)
        }

        // console.log(`[${this.name}.get] not found`)
        // 3. abort
        return null
    }

    getOrThrow = (id: string) => {
        const val = this.get(id)
        if (val == null) throw new Error(`ERR: ${this.name}(${id}) not found`)
        return val
    }

    getOrCreate = (id: string, def: () => Omit<T, $BaseInstanceFields>): L => {
        // console.log(`🦊 ${this.name}.getOrCreate`)
        // 1. check if instance exists in the entity map
        const val = this.get(id)
        if (val == null) return this.create(def())
        return val
    }

    /** 🔴 unfinished */
    delete = (id: string) => {
        delete this._store[id]
        this.instances.delete(id)
    }

    /** only call with brand new data */
    create = (data: Omit<T, $BaseInstanceFields> & Partial<BaseInstanceFields>): L => {
        const id: T['id'] = data.id ?? nanoid()
        if (data.id == null) data.id = id
        const now = Date.now()
        data.createdAt = now
        data.updatedAt = now

        // ensure no instance exists
        if (this.instances.has(id)) throw new Error(`ERR: ${this.name}(${id}) already exists`)

        // ensure no data with same id exists
        if (id in this._store) throw new Error(`ERR: ${this.name}(${id}) already exists in store`)

        this._store[id] = data as T

        const instance = this._createInstance(this._store[id])

        return instance
    }

    private instances = new Map<string, L>()

    /** only call this with some data already in the store */
    private _createInstance = (data: T): L => {
        const instance = new this.Ktor()
        instance.init(this, data)
        this.instances.set(data.id, instance)
        this.db.markDirty()
        return instance
    }

    upsert = (data: Omit<T, 'createdAt' | 'updatedAt'>): L => {
        const id = data.id
        // this.yjsMap.set(nanoid(), data)
        const prev = this.get(id)
        if (prev) {
            prev.update(data as any /* 🔴 */)
            return prev
        } else {
            const instance = this.create(data as any /* 🔴 */)
            return instance
        }
    }
}
