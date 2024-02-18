import type { STATE } from 'src/state/state'
import type { LiveDB } from './LiveDB'
import type { $BaseInstanceFields, BaseInstanceFields, LiveInstance, UpdateOptions } from './LiveInstance'

import { Value, ValueError } from '@sinclair/typebox/value'
import { action, makeAutoObservable, runInAction, toJS, type AnnotationMapEntry } from 'mobx'
import { nanoid } from 'nanoid'
import { schemas } from 'src/db/TYPES.gen'
import { TableInfo } from 'src/db/TYPES_json'
import { DEPENDS_ON, MERGE_PROTOTYPES } from './LiveHelpers'
import { SQLWhere, SqlFindOptions, isSqlExpr } from './SQLWhere'
import { timeStamp } from 'console'

export interface LiveEntityClass<T extends BaseInstanceFields, L> {
    new (...args: any[]): LiveInstance<T, L> & L
}

export class LiveTable<
    //
    T extends BaseInstanceFields,
    C extends any,
    L extends LiveInstance<T, L>,
> {
    private Ktor: LiveEntityClass<T, L>
    liveEntities = new Map<string, L>()
    keyUpdates: { [key: string]: Timestamp } = {}
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
        // console.log('last =', data)
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
            observabilityConfig?: { [key: string]: AnnotationMapEntry }

            /** pointer to the liveDB */
            db!: LiveDB

            /** pointer to the global state */
            st!: STATE

            /** parent table */
            table!: LiveTable<T, any, any>

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

            update_LiveOnly(changes: Partial<T>) {
                runInAction(() => {
                    Object.assign(this.data, changes)
                })
            }

            update(changes: Partial<T>, options?: UpdateOptions): void {
                runInAction(() => {
                    // check that changes is valid
                    if (Array.isArray(changes)) throw new Error('insert does not support arrays')
                    if (typeof changes !== 'object') throw new Error('insert does not support non-objects')

                    // 0. track changed keys.
                    const keysWithChanges: string[] = []
                    for (const k of Object.keys(changes)) {
                        // skip
                        const change = (changes as any)[k]
                        if (typeof change === 'object' && change != null) {
                            keysWithChanges.push(k)
                            continue
                        }
                        // abort if not an object
                        if ((this.data as any)[k] !== (changes as any)[k]) {
                            keysWithChanges.push(k)
                            continue
                        }
                    }

                    // 1. check if update is needed
                    const isSame = keysWithChanges.length === 0
                    if (options?.debug) console.log(`[🔴 DEBUG 🔴] UPDATING ${this.table.name}#${changes.id}`)
                    if (isSame) {
                        if (options?.debug) console.log(`[🔴 DEBUG 🔴]✔️ ${this.table.name}#${changes.id} no need to update`) // no need to update
                        return // ⏸️
                    }
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

                        // inject id and patch updatedAt
                        updatePayload.updatedAt = updatedAt
                        updatePayload.id = this.id

                        if (options?.debug) console.log(`[🔴 DEBUG 🔴] ${updateSQL} ${JSON.stringify(updatePayload)}`)
                        // update the data
                        stmt.get(updatePayload) as any as T

                        // assign the changes
                        // 2023-12-02 rvion: for now, I'm not re-assigning from the returned values
                        Object.assign(this.data, changes)
                        this.data.updatedAt = updatedAt
                        if (options?.debug) console.log(`[🔴 DEBUG 🔴] RESULT: ${JSON.stringify(this.data, null, 3)}`)
                        this.onUpdate?.(prev, this.data)
                        for (const k of keysWithChanges) {
                            this.table.keyUpdates[k] = Date.now()
                        }
                    } catch (e) {
                        console.log(updateSQL)
                        throw e
                    }
                })
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

            init(table: LiveTable<T, any, L>, data: T) {
                // console.log(`🔴 INIT`, data)
                this.db = table.db
                this.st = table.db.st
                this.table = table
                this.data = data
                this.onHydrate?.(data)
                this.onUpdate?.(undefined, data)
                makeAutoObservable(this, this.observabilityConfig as any)
            }

            log(...args: any[]) {
                console.log(`[${this.table.emoji}] ${this.table.name}:`, ...args)
            }
        }

        // make observable
        makeAutoObservable(this, {
            // @ts-ignore (private properties are untyped in this function)
            Ktor: false,
            _createInstance: action,
            get: action,
        })

        MERGE_PROTOTYPES(InstanceClass, BaseInstanceClass)
        this.Ktor = InstanceClass
    }

    // UTILITIES -----------------------------------------------------------------------
    private stmt_lastN = this.db.prepareAll<number, T>(this.infos, `select * from ${this.name} order by createdAt desc limit ?`)
    getLastN = (amount: number): L[] => {
        DEPENDS_ON(this.liveEntities.size)
        console.log(`[👙] coucou`, this.liveEntities.size)
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
        if (id == null) throw new Error(`ERR:  getOrThrow called without id`)
        const val = this.get(id)
        if (val == null) throw new Error(`ERR: ${this.name}(${id}) not found`)
        return val
    }

    getOrCreate = (id: string, def: () => Omit<T, $BaseInstanceFields>): L => {
        // console.log(`🦊 ${this.name}.getOrCreate`)
        // 1. check if instance exists in the entity map
        const val = this.get(id)
        if (val == null) {
            const data = def() as any
            if (data.id && data.id !== id) throw new Error(`GET OR CREATE INVARIANT VIOLATION`)
            if (data.id == null) data.id = id
            return this.create(data)
        }
        return val
    }

    // DELETION ------------------------------------------------------------

    // stmt_deleteByID = this.db.prepareDelete<string, void>(`delete from ${this.name} where id = ?`)

    /**
     * TODO: we this use this field to throw if a
     * deleted entity is accessed after beeing deleted
     */
    zz_deleted: boolean = false

    delete = (id: string) => {
        const sql = `delete from ${this.name} where id = ?`
        try {
            this.infos.backrefs.forEach((backref) => {
                const softCascadeSQL = `update ${backref.fromTable} set ${backref.fromField} = null where ${backref.fromField} = ?`
                console.log(`[🗑️] cascade `, softCascadeSQL, id)
                const stmt = this.db.db.prepare(softCascadeSQL)
                // 🔴 TODO: requires an update of all liveInstances too
                stmt.run(id)
            })
            console.log(`[🗑️] cascade `, sql, id)
            const stmt = this.db.prepareDelete<string, void>(sql)
            stmt(id)
            this.zz_deleted = true
            this.liveEntities.delete(id)
        } catch (e) {
            console.log(`[🗑️] sql failed:`, sql, [id])
            console.error(e)
            throw e
        }
    }
    // ------------------------------------------------------------

    // clear = () => {
    //     this.db.db.exec(`delete from ${this.name}`)
    //     this.liveEntities.clear()
    // }

    /**
     * probably unsafe to use
     * - update all in DB
     * - then patch all local instances bypassing the DB
     */
    updateAll = (changes: Partial<T>) => {
        const sql = `update ${this.name} set ${Object.keys(changes)
            .map((k) => `${k} = @${k}`)
            .join(', ')}`
        const stmt = this.db.db.prepare(sql)
        stmt.run(changes)
        for (const instance of this.liveEntities.values()) {
            instance.update_LiveOnly(changes)
        }
    }

    findAll = (): L[] => {
        const stmt = this.db.db.prepare(`select * from ${this.name}`)
        const datas: T[] = stmt.all().map((data) => this.infos.hydrateJSONFields(data))
        const instances = datas.map((d) => this.getOrCreateInstanceForExistingData(d))
        return instances
    }

    findOne = (
        //
        whereExt: SQLWhere<T>,
        options: SqlFindOptions = {},
    ): L | null => {
        return this.find(whereExt, { ...options, limit: 1 })[0] ?? null
    }

    find = (
        //
        whereExt: SQLWhere<T>,
        options: SqlFindOptions = {},
    ): L[] => {
        let whereClause: string[] = []
        let whereVars: { [key: string]: any } = {}

        Object.entries(whereExt).forEach(([k, v]) => {
            if (isSqlExpr(v)) {
                if ('$like' in v) {
                    whereVars[k] = v.$like
                    whereClause.push(`${k} like @${k}`)
                } else {
                    throw new Error(`[👙] 🔴`)
                }
            } else {
                whereVars[k] = v
                whereClause.push(`${k} = @${k}`)
            }
        })
        let findSQL = `select * from ${this.name}`
        if (whereClause.length > 0) findSQL += ` where ${whereClause.join(' and ')}`
        if (options.limit) findSQL += ` limit ${options.limit}`

        if (options.debug) console.log(`[🔴 DEBUG 🔴] A >>>`, findSQL, whereVars)
        const stmt = this.db.db.prepare<{ [key: string]: any }>(findSQL)
        const datas: T[] = stmt.all(whereVars).map((data) => this.infos.hydrateJSONFields(data))
        if (options.debug) console.log(`[🔴 DEBUG 🔴] B >>>`, datas)
        const instances = datas.map((d) => this.getOrCreateInstanceForExistingData(d))
        // ⏸️ console.log(`[🦜] find:`, { findSQL, instances })
        return instances
    }

    private insert = (row: Partial<T>): L => {
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

    upsert = (data: Omit<C, 'createdAt' | 'updatedAt'> & { id: T['id'] }): L => {
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

    // upsert = (data: Omit<T, $OptionalFieldsForUpsert> & Partial<$OptionalFieldsForUpsert>): L => {
    //     const prev = this.get(data.id)
    //     if (prev == null) return this.create(data as any)
    //     prev.update(data as any)
    //     return prev
    // }

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
    _createInstance = (data: T): L => {
        const instance = new this.Ktor()
        // TYPE CHECKING --------------------
        const schema = this.infos.schema
        const valid = Value.Check(schema, data)
        if (!valid) {
            const errors: ValueError[] = [...Value.Errors(schema, data)]
            console.log('❌', this.name)
            for (const i of errors) console.log(`❌`, JSON.stringify(i))
            // debugger
        }
        // --------------------
        instance.init(this, data)
        this.liveEntities.set(data.id, instance)
        return instance
    }
}
