import type { STATE } from '../state/state'
import type { LiveDB } from './LiveDB'
import type { $BaseInstanceFields, LiveInstance, UpdateOptions } from './LiveInstance'
import type { CompiledQuery, SelectQueryBuilder } from 'kysely'

// 2024-03-14 commented serial checks for now
// import { Value, ValueError } from '@sinclair/typebox/value'
import { action, type AnnotationMapEntry, makeAutoObservable, observable, runInAction, toJS } from 'mobx'
import { nanoid } from 'nanoid'

import { kysely } from '../DB'
import { sqlbench, sqlbenchRaw } from '../utils/microbench'
import { DEPENDS_ON, MERGE_PROTOTYPES } from './LiveHelpers'
import { quickBench } from './quickBench'
import { SqlFindOptions } from './SQLWhere'
import { type KyselyTables, type LiveDBSubKeys, schemas } from './TYPES.gen'
import { TableInfo } from './TYPES_json'

export interface LiveEntityClass<TABLE extends TableInfo> {
    new (...args: any[]): TABLE['$L']
}

export class LiveTable<TABLE extends TableInfo<keyof KyselyTables>> {
    select = (
        fn: (
            x: SelectQueryBuilder<KyselyTables, TABLE['$TableName'], TABLE['$T']>,
        ) => SelectQueryBuilder<any, any, TABLE['$T']> = (x) => x,
        subscriptions?: LiveDBSubKeys[],
    ): TABLE['$L'][] => {
        const query = fn(this.query1).compile() // finalize the kysely query
        const stmt = cushy.db.db.prepare(query.sql) // prepare the statement
        if (stmt == null) return []
        cushy.db.subscribeToKeys([this.schema.sql_name])
        if (subscriptions) cushy.db.subscribeToKeys(subscriptions) // make sure this getter will re-run when any of the deps change
        const x = sqlbench(query, () => stmt.all(query.parameters)) // execute the statement
        const hydrated = x.map((data) => this.schema.hydrateJSONFields_crashOnMissingData(data)) // hydrate results
        const instances = hydrated.map((d) => this.getOrCreateInstanceForExistingData(d)) // create instances
        return instances
    }

    selectRaw = <T>(
        fn: (x: SelectQueryBuilder<KyselyTables, TABLE['$TableName'], {}>) => SelectQueryBuilder<any, any, T>,
        subscriptions?: LiveDBSubKeys[],
    ): T[] => {
        const query = fn(this.query1).compile() // finalize the kysely query
        const stmt = cushy.db.db.prepare(query.sql) // prepare the statement
        if (stmt == null) return []
        if (subscriptions) cushy.db.subscribeToKeys(subscriptions) // make sure this getter will re-run when any of the deps change
        const x = sqlbench(query, () => stmt.all(query.parameters)) // execute the statement
        return x as any[] // return the result
    }

    query1: SelectQueryBuilder<KyselyTables, TABLE['$TableName'], TABLE['$T']> = kysely.selectFrom(this.name).selectAll(this.name)
    query2: SelectQueryBuilder<KyselyTables, TABLE['$TableName'], /*    */ {}> = kysely.selectFrom(this.name).selectAll(this.name)
    // ⏸️ query2: SelectQueryBuilder<KyselyTables, any, {}> = dbxx.selectFrom(this.name)
    // ⏸️ query3: SelectQueryBuilder<KyselyTables, TABLE['$TableName'], TABLE['$T']> = dbxx.selectFrom(this.name).selectAll() as any

    private Ktor: LiveEntityClass<TABLE>
    liveEntities = new Map<string, TABLE['$L']>()
    schema: TABLE = schemas[this.name] as any
    $DATA!: TABLE['$T']
    // 🟢 --------------------------------------------------------------------------------

    /** number of entities in the table */
    get size() {
        DEPENDS_ON(this.liveEntities.size)
        return this.db._getCount(this.name)
    }

    // 🟢 --------------------------------------------------------------------------------
    getOrCreateInstanceForExistingData = (data: TABLE['$T']): TABLE['$L'] => {
        const id = (data as { id: string }).id
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
    stmt_first = this.db.compileSelectOne_<TABLE>(this.schema, `select * from ${this.name} order by createdAt asc limit 1`)
    first = (): Maybe<TABLE['$L']> => {
        return this.first_
    }
    get first_(): Maybe<TABLE['$L']> {
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
    firstOrCrash = (): TABLE['$L'] => {
        const fst = this.first()
        if (fst == null) throw new Error('collection is empty')
        return fst
    }

    // 🟢 --------------------------------------------------------------------------------
    /** return last entity from table, or null if table is empty */
    stmt_query = `select * from ${this.name} order by createdAt desc limit 1`
    stmt_last = this.db.compileSelectOne_<TABLE>(this.schema, this.stmt_query)

    // 2024-06-13 rvion; perf issue was caused by this
    // beeing a function instead of a getter;
    last = (): Maybe<TABLE['$L']> => {
        return this.last_
    }

    get last_(): Maybe<TABLE['$L']> {
        console.log(`[🤠] last ${this.name} (hash=size:${this.liveEntities.size})`)
        const data = sqlbenchRaw(this.stmt_query, this.stmt_last) // sqlbench(this.stmt_last, 0 as any)
        DEPENDS_ON(this.liveEntities.size)
        // console.log('last =', data)
        if (data == null) return null
        return this.getOrCreateInstanceForExistingData(data)
    }

    // 🟢 --------------------------------------------------------------------------------
    /** return last entity from table, or crash if table is empty */
    lastOrCrash = (): TABLE['$L'] => {
        const lst = this.last()
        if (lst == null) throw new Error('collection is empty')
        return lst
    }

    constructor(
        //
        public db: LiveDB,

        public name: TableNameInDB,
        public emoji: string,
        public InstanceClass: LiveEntityClass<TABLE>,
        public opts?: { singleton?: boolean },
    ) {
        // register
        this.db._tables.push(this)

        const BaseInstanceClass = class implements LiveInstance<TABLE> {
            observabilityConfig?: { [key: string]: AnnotationMapEntry }

            /** pointer to the liveDB */
            db!: LiveDB

            /** pointer to the global state */
            st!: STATE

            /** parent table */
            table!: LiveTable<TABLE>

            /** instance data */
            data!: TABLE['$T'] & {
                id: TABLE['$ID']
                createdAt: number
                updatedAt: number
            }

            /** on original creation */
            onCreate?: (/* data: TABLE['$T'] */) => void

            /** on hydratation */
            onHydrate?: (/* data: TABLE['$T'] */) => void

            /** this must be fired after hydrate and update */
            onUpdate?: (
                //
                prev: Maybe<TABLE['$T']>,
                next: TABLE['$T'],
            ) => void

            get id() { return this.data.id } // prettier-ignore
            get createdAt() { return this.data.createdAt } // prettier-ignore
            get updatedAt() { return this.data.updatedAt } // prettier-ignore
            get tableName() { return this.table.name } // prettier-ignore

            update_LiveOnly(changes: Partial<TABLE['$T']>) {
                runInAction(() => {
                    Object.assign(this.data, changes)
                })
            }

            update(changes: TABLE['$Update'] & { id: string }, options?: UpdateOptions): void {
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
                    const tableInfos = this.table.schema
                    const presentCols = Object.keys(changes)
                    presentCols.push('updatedAt')
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
                        const stmt = this.db.db.prepare<Partial<TABLE['$T']>>(updateSQL)

                        // dehydrate fields needed to be updated
                        const updatePayload: any = Object.fromEntries(
                            Object.entries(changes as any).map(([k, v]) => {
                                if (v instanceof Uint8Array) return [k, v]
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
                        const A = process.hrtime.bigint() // TIMER start
                        stmt.get(updatePayload) as any as TABLE['$T']
                        const B = process.hrtime.bigint() // TIMER end
                        const ms = Number(B - A) / 1_000_000
                        const emoji = ms > 4 ? '🔴' : ms > 1 ? '🔶' : ''
                        console.log(`[🚧] SQL [${ms.toFixed(3)}ms]`, emoji, updateSQL, { updatePayload }) // debug

                        // assign the changes
                        // 2023-12-02 rvion: for now, I'm not re-assigning from the returned values
                        Object.assign(this.data, changes)
                        this.data.updatedAt = updatedAt
                        if (options?.debug) console.log(`[🔴 DEBUG 🔴] RESULT: ${JSON.stringify(this.data, null, 3)}`)
                        this.onUpdate?.(prev, this.data)
                        for (const k of keysWithChanges) {
                            this.db.bump(`${this.table.name}.${k}` as LiveDBSubKeys)
                        }
                    } catch (e) {
                        console.log(updateSQL)
                        throw e
                    }
                })
            }

            clone(t?: Partial<TABLE['$T']>): TABLE['$T'] {
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

            init(table: LiveTable<TABLE>, data: TABLE['$T']) {
                // console.log(`🔴 INIT`, data)
                /* 🚝 */ const startTime = process.hrtime()
                this.db = table.db
                this.st = table.db.st
                this.table = table
                this.data = data

                // prettier-ignore
                /* 🔶 PERF HACK */ if (this.tableName === 'comfy_schema') {
                /* 🔶 PERF HACK */     ;(data as any as { spec: { a: 1 } }).spec = observable(
                /* 🔶 PERF HACK */         (data as any as { spec: { a: 1 } }).spec,
                /* 🔶 PERF HACK */         {},
                /* 🔶 PERF HACK */         { deep: false },
                /* 🔶 PERF HACK */     )
                /* 🔶 PERF HACK */ }

                this.onHydrate?.(/* data */)
                this.onUpdate?.(undefined, data)
                makeAutoObservable(this, this.observabilityConfig as any)
                /* 🚝 */ const endTime = process.hrtime(startTime)
                /* 🚝 */ const ms = endTime[1] / 1000000
                /* 🚝 */ quickBench.addStats(`init:${table.name}`, ms)
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
    private SKL_getLastN = this.db.compileSelectMany<number, TABLE>( //
        this.schema,
        `select * from ${this.name} order by createdAt desc limit ?`,
    )
    getLastN = (amount: number): TABLE['$L'][] => {
        DEPENDS_ON(this.liveEntities.size)
        const ts = this.SKL_getLastN(amount)
        return ts.map((data) => this.getOrCreateInstanceForExistingData(data))
    }
    get Last10(): TABLE['$L'][] {
        DEPENDS_ON(this.liveEntities.size)
        const ts = this.SKL_getLastN(10)
        return ts.map((data) => this.getOrCreateInstanceForExistingData(data))
    }
    // ⏸️ mapData = <R>(fn: (k: T['id'], t: T) => R): R[] =>
    // ⏸️     Object.values(this._store) //
    // ⏸️         .map((data) => fn(data.id, data))

    // UTILITIES -----------------------------------------------------------------------

    private stmt_getByID = this.db.compileSelectOne<string, TABLE>(this.schema, `select * from ${this.name} where id = ?`)
    get = (id: Maybe<string>): Maybe<TABLE['$L']> => {
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

    getOrThrow = (id: string): TABLE['$L'] => {
        if (id == null) throw new Error(`ERR:  getOrThrow called without id`)
        const val = this.get(id)
        if (val == null) throw new Error(`ERR: ${this.name}(${id}) not found`)
        return val
    }

    getOrCreate = (id: string, def: () => Omit<TABLE['$T'], $BaseInstanceFields>): TABLE['$L'] => {
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
            this.schema.backrefs.forEach((backref) => {
                const softCascadeSQL = `update ${backref.fromTable} set ${backref.fromField} = null where ${backref.fromField} = ?`
                console.log(`[🗑️] cascade `, softCascadeSQL, id)
                const stmt = this.db.db.prepare(softCascadeSQL)
                // 🔴 TODO: requires an update of all liveInstances too
                stmt.run(id)
            })
            console.log(`[🗑️] cascade `, sql, id)
            const stmt = this.db.compileDelete<string, void>(sql)
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
    updateAll = (changes: Partial<TABLE['$T']>) => {
        const sql = `update ${this.name} set ${Object.keys(changes)
            .map((k) => `${k} = @${k}`)
            .join(', ')}`
        const stmt = this.db.db.prepare(sql)
        stmt.run(changes)
        for (const instance of this.liveEntities.values()) {
            instance.update_LiveOnly(changes)
        }
    }

    findAll = (): TABLE['$L'][] => {
        const stmt = this.db.db.prepare(`select * from ${this.name}`)
        const datas: TABLE['$T'][] = stmt.all().map((data) => this.schema.hydrateJSONFields_crashOnMissingData(data))
        const instances = datas.map((d) => this.getOrCreateInstanceForExistingData(d))
        return instances
    }

    find = (
        //
        queryFn: (x: SelectQueryBuilder<KyselyTables, TABLE['$TableName'], {}>) => CompiledQuery<TABLE['$T']>,
        options: SqlFindOptions = {},
    ): TABLE['$L'][] => {
        // let whereClause: string[] = []
        // let whereVars: { [key: string]: any } = {}
        // Object.entries(whereExt).forEach(([k, v]) => {
        //     if (isSqlExpr(v)) {
        //         if ('$like' in v) {
        //             whereVars[k] = v.$like
        //             whereClause.push(`${k} like @${k}`)
        //         } else {
        //             throw new Error(`[🧐] 🔴`)
        //         }
        //     } else {
        //         whereVars[k] = v
        //         whereClause.push(`${k} = @${k}`)
        //     }
        // })
        // let findSQL = `select * from ${this.name}`
        // if (whereClause.length > 0) findSQL += ` where ${whereClause.join(' and ')}`
        // if (options.limit) findSQL += ` limit ${options.limit}`
        // if (options.debug) console.log(`[🔴 DEBUG 🔴] A >>>`, findSQL, whereVars)
        // const stmt = this.db.db.prepare<{ [key: string]: any }>(findSQL)
        const query = queryFn(this.query1)
        const stmt = cushy.db.db.prepare<{ [key: string]: any }>(query.sql)
        const datas: TABLE['$T'][] = stmt
            .all(query.parameters)
            .map((data) => this.schema.hydrateJSONFields_crashOnMissingData(data))
        if (options.debug) console.log(`[🔴 DEBUG 🔴] B >>>`, datas)
        const instances = datas.map((d) => this.getOrCreateInstanceForExistingData(d))
        // ⏸️ console.log(`[🦜] find:`, { findSQL, instances })
        return instances
    }

    private insert = (row: Partial<TABLE['$T']>): TABLE['$L'] => {
        // 0 check that row is valid
        if (Array.isArray(row)) throw new Error('insert does not support arrays')
        if (typeof row !== 'object') throw new Error('insert does not support non-objects')

        // build the sql
        const tableInfos = this.schema
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
            const stmt = this.db.db.prepare<Partial<TABLE['$T']>>(insertSQL)

            // dehydrate json fields
            const insertPayload: any = Object.fromEntries(
                Object.entries(row as any).map(([k, v]) => {
                    if (Array.isArray(v)) return [k, JSON.stringify(v)]
                    if (typeof v === 'object' && v != null) return [k, JSON.stringify(v) ?? 'null']
                    return [k, v]
                }),
            )

            // insert the data
            const data = stmt.get(insertPayload) as any as TABLE['$T']

            // re-hydrate the resulting json (necessary for default json values in the DB)
            this.schema.hydrateJSONFields_crashOnMissingData(data)

            // return the instance
            return this._createInstance(data)
        } catch (e) {
            console.log(insertSQL)
            throw e
        }
    }

    upsert = (data: Omit<TABLE['$N'], 'createdAt' | 'updatedAt'> & { id: TABLE['$ID'] }): TABLE['$L'] => {
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
    create = (data: TABLE['$N']): TABLE['$L'] => {
        // enforce singlettons
        if (this.opts?.singleton) {
            const count = this.size
            if (count !== 0) throw new Error('ERR: singleton already exists')
        }

        const id: TABLE['$ID'] = data.id ?? nanoid()
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
        instance.onCreate?.(/* data as T */)

        return instance
    }

    /** only call this with some data already in the database */
    _createInstance = (data: TABLE['$T']): TABLE['$L'] => {
        const instance = new this.Ktor()
        // TYPE CHECKING --------------------
        // /* ⏸️ */ const schema = this.schema.schema
        // /* ⏸️ */ const valid = Value.Check(schema, data)
        // /* ⏸️ */ if (!valid) {
        // /* ⏸️ */     const errors: ValueError[] = [...Value.Errors(schema, data)]
        // /* ⏸️ */     console.log('❌', this.name)
        // /* ⏸️ */     for (const i of errors) console.log(`❌`, JSON.stringify(i))
        // /* ⏸️ */     // debugger
        // /* ⏸️ */ }
        // --------------------
        instance.init(this, data)
        this.liveEntities.set(data.id, instance)
        this.db.bump(this.name as LiveDBSubKeys)
        return instance
    }
}
