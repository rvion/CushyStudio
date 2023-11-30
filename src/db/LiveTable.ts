import { Value, ValueError } from '@sinclair/typebox/value'
import { makeAutoObservable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { schemas } from 'src/db2/TYPES.gen'
import { TableInfo } from 'src/db2/TYPES_json'
import type { STATE } from 'src/state/state'
import type { LiveDB } from './LiveDB'
import { DEPENDS_ON, MERGE_PROTOTYPES } from './LiveHelpers'
import type { $BaseInstanceFields, BaseInstanceFields, LiveInstance } from './LiveInstance'

export interface LiveEntityClass<T extends BaseInstanceFields, L> {
    new (...args: any[]): LiveInstance<T, L> & L
}

export class LiveTable<T extends BaseInstanceFields, L extends LiveInstance<T, L>> {
    private Ktor: LiveEntityClass<T, L>
    liveEntities = new Map<string, L>()
    infos: TableInfo = schemas[this.name]

    // 🟢 --------------------------------------------------------------------------------
    /** number of entities in the table */
    get size() {
        DEPENDS_ON(this.liveEntities.size)
        return this.db._getCount(this.name)
    }

    // 🟢 --------------------------------------------------------------------------------
    getOrCreateInstanceForExistingData = (data: T): L => {
        const id = data.id
        const instance = this.liveEntities.get(id)
        if (instance) {
            // 2023-11-30 rvion: for now, I won't defensively merge the data
            // I'll do it if the app become more complex and bugs arise.
            // Object.assign(instance.data, data)
            return instance
        } else {
            return this._createInstance(data)
        }
    }

    // 🟢 --------------------------------------------------------------------------------
    /** return first entity from table, or null if table is empty */
    stmt_first = this.db.prepareGet0<Maybe<T>>(this.infos, `select * from ${this.name} order by createdAt asc limit 1`)
    first = (): Maybe<L> => {
        const data = this.stmt_first()
        // 2023-11-30 rvion:
        // 👇 first should mosltly not depends on anything
        // I'll comment this out for the time being
        // DEPENDS_ON(this.liveEntities.size)
        if (data == null) return null
        return this.getOrCreateInstanceForExistingData(data)
    }

    // 🟢 --------------------------------------------------------------------------------
    /** return first entity from table by createdAt, or crash if table is empty */
    firstOrCrash = (): L => {
        const fst = this.first()
        if (fst == null) throw new Error('collection is empty')
        return fst
    }

    // 🟢 --------------------------------------------------------------------------------
    /** return last entity from table, or null if table is empty */
    stmt_last = this.db.prepareGet0<Maybe<T>>(this.infos, `select * from ${this.name} order by createdAt desc limit 1`)
    last = (): Maybe<L> => {
        const data = this.stmt_last()
        DEPENDS_ON(this.liveEntities.size)
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
        public name: TableNameInDB,
        public emoji: string,
        public InstanceClass: LiveEntityClass<T, L>,
        public opts?: { singleton?: boolean },
    ) {
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
            get tableName() { return this.table.name } // prettier-ignore

            update(changes: Partial<T>) {
                // 0. check that changes is valid
                if (Array.isArray(changes)) throw new Error('insert does not support arrays')
                if (typeof changes !== 'object') throw new Error('insert does not support non-objects')

                // 1. check if update is needed
                const isSame = Object.keys(changes).every((k) => (this.data as any)[k] === (changes as any)[k])
                if (isSame) return console.log('no need to update') // no need to update

                // 2. store the prev in case we have an onUpdate callback later
                const prev = this.onUpdate //
                    ? JSON.parse(JSON.stringify(this.data))
                    : undefined

                // build the sql
                const tableInfos = this.table.infos
                const presentCols = Object.keys(changes)
                const updateSQL = [
                    `update ${tableInfos.sql_name}`,
                    `set`,
                    presentCols.map((c) => `${c} = @${c}`).join(', '),
                    `where id = @id`,
                    `returning *`,
                ].join(' ')

                const updatedAt = Date.now()
                try {
                    // prepare sql
                    const stmt = this.db.db.prepare<Partial<T>>(updateSQL)

                    // dehydrate fields needed to be updated
                    const updatePayload: any = Object.fromEntries(
                        Object.entries(changes as any).map(([k, v]) => {
                            if (Array.isArray(v)) return [k, JSON.stringify(v)]
                            if (typeof v === 'object' && v != null) return [k, JSON.stringify(v) ?? 'null']
                            return [k, v]
                        }),
                    )
                    updatePayload.updatedAt = updatedAt
                    updatePayload.id = this.id

                    // update the data
                    /*const data =*/ stmt.get(updatePayload) as any as T

                    Object.assign(this.data, changes)
                    this.data.updatedAt = updatePayload
                    this.onUpdate?.(prev, this.data)
                } catch (e) {
                    console.log(updateSQL)
                    throw e
                }
            }

            clone(t?: Partial<T>): T {
                const cloneData = Object.assign(
                    //
                    {}, // receiving object
                    toJS(this.data), // original object
                    {
                        // 2023-11-30 rvion:: no need to set the createdAt and updatedAt
                        // they'll be taken care of by the create functio below
                        id: nanoid(), // overrides
                        ...t,
                    },
                )
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
        })

        MERGE_PROTOTYPES(InstanceClass, BaseInstanceClass)
        this.Ktor = InstanceClass
    }

    // UTILITIES -----------------------------------------------------------------------
    private stmt_lastN = this.db.prepareAll<number, T>(this.infos, `select * from ${this.name} order by createdAt desc limit ?`)
    getLastN = (amount: number): L[] => {
        DEPENDS_ON(this.liveEntities.size)
        const ts = this.stmt_lastN(amount)
        return ts.map((data) => this.getOrCreateInstanceForExistingData(data))
    }
    get Last10(): L[] {
        DEPENDS_ON(this.liveEntities.size)
        const ts = this.stmt_lastN(10)
        return ts.map((data) => this.getOrCreateInstanceForExistingData(data))
    }

    // getLastN = (n: number): T[] => {
    //     return this.stmt_lastN(n)
    // }

    get values(): 0 {
        return 0
        // 🔴
        // return this.ids.map((id) => this.getOrThrow(id))
    }

    // ⏸️ mapData = <R>(fn: (k: T['id'], t: T) => R): R[] =>
    // ⏸️     Object.values(this._store) //
    // ⏸️         .map((data) => fn(data.id, data))

    // UTILITIES -----------------------------------------------------------------------

    private stmt_getByID = this.db.prepareGet<string, Maybe<T>>(this.infos, `select * from ${this.name} where id = ?`)
    get = (id: Maybe<string>): Maybe<L> => {
        // if (id === 'main-schema') debugger
        if (id == null) return null

        // 1. check if instance exists in the entity map
        const val = this.liveEntities.get(id)
        if (val) return val

        // 2. check if data is on sqlite
        const x = this.stmt_getByID(id)
        if (x == null) return null

        // 3. create instance form data
        return this._createInstance(x)
    }

    getOrThrow = (id: string): L => {
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
        this.liveEntities.delete(id)
    }

    find = (query: Partial<T>): L[] => {
        const findSQL = [
            `select * from ${this.name}`,
            `where`,
            Object.entries(query)
                .map(([k, v]) => `${k} = @${k}`)
                .join(' and '),
        ].join(' ')
        const stmt = this.db.db.prepare<{ [key: string]: any }>(findSQL)
        const datas: T[] = stmt.all(query).map((data) => this.infos.hydrateJSONFields(data))
        const instances = datas.map((d) => this.getOrCreateInstanceForExistingData(d))
        console.log(`[🦜] find:`, { findSQL, instances })
        return instances
    }
    insert = (row: Partial<T>): L => {
        // 0 check that row is valid
        if (Array.isArray(row)) throw new Error('insert does not support arrays')
        if (typeof row !== 'object') throw new Error('insert does not support non-objects')

        // build the sql
        const tableInfos = this.infos
        const presentCols = Object.keys(row)
        const insertSQL = [
            `insert into ${tableInfos.sql_name}`,
            `(${presentCols.map((c) => c).join(', ')})`,
            `values`,
            `(${presentCols.map((c) => `@${c}`).join(', ')})`,
            `returning *`,
        ].join(' ')

        try {
            // prepare sql
            const stmt = this.db.db.prepare<Partial<T>>(insertSQL)

            // dehydrate json fields
            const insertPayload: any = Object.fromEntries(
                Object.entries(row as any).map(([k, v]) => {
                    if (Array.isArray(v)) return [k, JSON.stringify(v)]
                    if (typeof v === 'object' && v != null) return [k, JSON.stringify(v) ?? 'null']
                    return [k, v]
                }),
            )

            // insert the data
            const data = stmt.get(insertPayload) as any as T

            // re-hydrate the resulting json (necessary for default json values in the DB)
            this.infos.hydrateJSONFields(data)

            // return the instance
            return this._createInstance(data)
        } catch (e) {
            console.log(insertSQL)
            throw e
        }
    }

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
        // if (this.instances.has(id)) throw new Error(`ERR: ${this.name}(${id}) already exists`)
        // TOCTOU
        // console.log('🟢 A', data)
        const insertPayload = Object.fromEntries(
            Object.entries(data).map(([k, v]) => {
                if (Array.isArray(v)) return [k, JSON.stringify(v)]
                if (typeof v === 'object' && v != null) return [k, JSON.stringify(v) ?? 'null']
                return [k, v]
            }),
        )
        // console.log('🟢 B', insertPayload)
        this.insert(insertPayload as any)
        // console.log('🔴', data)

        // this._store[id] = data as T

        const instance = this._createInstance(data as any) //this._store[id])
        instance.onCreate?.(data as T)

        return instance
    }

    /** only call this with some data already in the database */
    private _createInstance = (data: T): L => {
        const instance = new this.Ktor()
        // TYPE CHECKING --------------------
        const schema = this.infos.schema
        const valid = Value.Check(schema, data)
        if (!valid) {
            const errors: ValueError[] = [...Value.Errors(schema, data)]
            console.log('❌', this.name)
            for (const i of errors) console.log(`❌`, JSON.stringify(i))
            debugger
        }
        // --------------------
        instance.init(this, data)
        this.liveEntities.set(data.id, instance)
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
