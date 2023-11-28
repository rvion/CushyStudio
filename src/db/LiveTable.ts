import type { STATE } from 'src/state/state'
import type { LiveDB } from './LiveDB'
import type { $BaseInstanceFields, BaseInstanceFields, LiveInstance } from './LiveInstance'
import type { TableName } from './LiveStore'

import { makeAutoObservable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { MERGE_PROTOTYPES } from './LiveHelpers'
import { LiveOrdering } from './LiveOrdering'

export interface LiveEntityClass<T extends BaseInstanceFields, L> {
    new (...args: any[]): LiveInstance<T, L> & L
}

export class LiveTable<T extends BaseInstanceFields, L extends LiveInstance<T, L>> {
    private Ktor: LiveEntityClass<T, L>
    private liveEntities = new Map<string, T>()
    // toJSON = (): Indexed<T> => this._store

    // 🔴 --------------------------------------------------------------------------------
    find = (check: (l: L) => boolean): Maybe<L> => {
        for (const v of this.values) if (check(v)) return v
        return null
    }

    // 🔴 --------------------------------------------------------------------------------
    filter = (check: (l: L) => boolean): L[] => {
        const res: L[] = []
        for (const v of this.values) if (check(v)) res.push(v)
        return res
    }

    // 🔴 --------------------------------------------------------------------------------
    findOrCrash = (check: (l: L) => boolean): L => {
        for (const v of this.values) {
            if (check(v)) return v
        }
        throw new Error('no entry found')
    }

    // 🟢🔶 --------------------------------------------------------------------------------
    /** number of entities in the table */
    get size() { return this.db._getCount(this.name) } // prettier-ignore

    // 🟢 --------------------------------------------------------------------------------
    private getOrCreateInstanceForExistingData = (data: T): L => {
        const id = data.id
        const instance = this.instances.get(id)
        if (instance) {
            Object.assign(instance.data, data)
            return instance
        }
        const newInstance = this._createInstance(data)
        this.instances.set(id, newInstance)
        return newInstance
    }

    // 🟢 --------------------------------------------------------------------------------
    /** return first entity from table, or null if table is empty */
    stmt_first = this.db.prepareGet<void, Maybe<T>>(`select * from ${this.name} order by createdAt asc limit 1`)
    first = (): Maybe<L> => {
        const data = this.stmt_first()
        console.log('first =', data)
        if (data == null) return null
        return this.getOrCreateInstanceForExistingData(data)
    }

    // 🟢 --------------------------------------------------------------------------------
    /** return first entity from table, or crash if table is empty */
    firstOrCrash = (): L => {
        const fst = this.first()
        if (fst == null) throw new Error('collection is empty')
        return fst
    }

    // 🟢 --------------------------------------------------------------------------------
    /** return last entity from table, or null if table is empty */
    stmt_last = this.db.prepareGet<void, Maybe<T>>(`select * from ${this.name} order by createdAt desc limit 1`)
    last = (): Maybe<L> => {
        const data = this.stmt_last()
        console.log('last =', data)
        if (data == null) return null
        return this.getOrCreateInstanceForExistingData(data)
    }

    // 🟢 --------------------------------------------------------------------------------
    /** return last entity from table, or crash if table is empty */
    lastOrCrash = (): L => {
        const lst = this.last()
        if (lst == null) throw new Error('collection is empty')
        return lst
    }

    constructor(
        //
        public db: LiveDB,
        public name: TableName,
        public emoji: string,
        public InstanceClass: LiveEntityClass<T, L>,
        public opts?: { singleton?: boolean },
    ) {
        // ensure store has a key for this table
        // if (!(name in db.store.models)) db.store.models[name] = {}
        // this._store = (db.store.models as any)[name] as

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
                // 1. check if update is needed
                const isSame = Object.keys(t).every((k) => (this.data as any)[k] === (t as any)[k])
                if (isSame) return console.log('no need to update') // no need to update
                // 2. update
                const prev = this.onUpdate //
                    ? JSON.parse(JSON.stringify(this.data))
                    : undefined
                Object.assign(this.data, t)
                this.data.updatedAt = Date.now()
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

            log(...args: any[]) {
                console.log(`[${this.table.emoji}] ${this.table.name}:`, ...args)
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

    // clear = () => {
    //     this.instances.clear()
    //     for (const k of this.ids) delete this._store[k]
    // }

    // get ids(): T['id'][] {
    //     return Object.keys(this._store)
    // }
    createdAtDesc = new LiveOrdering(this, 'createdAt', 'desc')

    get values(): L[] {
        return this.ids.map((id) => this.getOrThrow(id))
    }

    // 🔴 meh
    mapData = <R>(fn: (k: T['id'], t: T) => R): R[] => Object.values(this._store).map((data) => fn(data.id, data))

    // UTILITIES -----------------------------------------------------------------------

    stmt_getByID = this.db.prepareGet<string, Maybe<T>>(`select * from ${this.name} where id = ?`)
    get = (id: Maybe<string>): Maybe<L> => {
        if (id == null) return null

        // 1. check if instance exists in the entity map
        const val = this.instances.get(id)
        if (val) return val

        // 2. check if data is on sqlite
        const x = this.stmt_getByID(id)
        if (x == null) return null

        // 3. first time fetched => cache it in the entity map
        this.instances.set(id, this._createInstance(x))
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
    stmt_deleteByID = this.db.prepareDelete<string, void>(`delete from ${this.name} where id = ?`)
    delete = (id: string) => {
        this.stmt_deleteByID(id)
        this.instances.delete(id)
    }

    private _getInsertPlaceholders
    stmt_insert = this.db.prepareInsert<Omit<T, $BaseInstanceFields>, void>(
        `insert into ${this.name} values (${this.db._getInsertPlaceholders(this.name)})`,
    )
    /** only call with brand & never seen new data */
    create = (data: Omit<T, $BaseInstanceFields> & Partial<BaseInstanceFields>): L => {
        // enforce singlettons
        if (this.opts?.singleton) {
            const count = this.size
            if (count !== 0) throw new Error('ERR: singleton already exists')
        }

        const id: T['id'] = data.id ?? nanoid()
        if (data.id == null) data.id = id
        const now = Date.now()
        data.createdAt = now
        data.updatedAt = now

        // ensure no instance exists
        if (this.instances.has(id)) throw new Error(`ERR: ${this.name}(${id}) already exists`)

        this

        this._store[id] = data as T

        const instance = this._createInstance(this._store[id])
        instance.onCreate?.(data as T)

        return instance
    }

    private instances = new Map<string, L>()

    /** only call this with some data already in the store */
    private _createInstance = (data: T): L => {
        const instance = new this.Ktor()
        instance.init(this, data)
        this.instances.set(data.id, instance)
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
