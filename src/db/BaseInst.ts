import type { STATE } from '../state/state'
import type { LiveDB } from './LiveDB'
import type { UpdateOptions } from './LiveInstance'
import type { LiveTable } from './LiveTable'
import type { KyselyTables, LiveDBSubKeys } from './TYPES.gen'
import type { TableInfo } from './TYPES_json'

import { type AnnotationMapEntry, observable, runInAction, toJS } from 'mobx'
import { nanoid } from 'nanoid'

import { quickBench } from './quickBench'

export interface BaseInst<TABLE extends TableInfo<keyof KyselyTables>> {
   dataObservabilityConfig?: { [key in keyof TABLE['$T']]?: AnnotationMapEntry } | undefined
}

export abstract class BaseInst<TABLE extends TableInfo<keyof KyselyTables>> {
   @observable.ref accessor data: TABLE['$T']

   constructor(
      /** pointer to the liveDB */
      public db: LiveDB,

      /** pointer to the global state */
      public st: STATE,

      /** parent table */
      public table: LiveTable<TABLE, any>,

      /** data */
      data: TABLE['$T'],
      // & {
      //     id: TABLE['$ID']
      //     createdAt: number
      //     updatedAt: number
      // },
   ) {
      this.data = data
   }

   /** instance data */
   // data!: TABLE['$T'] & {
   //     id: TABLE['$ID']
   //     createdAt: number
   //     updatedAt: number
   // }

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

   get id(): TABLE['$ID'] {
      return this.data.id
   }

   get createdAt(): Timestamp {
      return this.data.createdAt as Timestamp
   }

   get updatedAt(): Timestamp {
      return this.data.updatedAt as Timestamp
   }

   get tableName(): TableNameInDB {
      return this.table.name
   }

   update_LiveOnly(changes: Partial<TABLE['$T']>): void {
      runInAction(() => {
         Object.assign(this.data, changes)
      })
   }

   update(changes: TABLE['$Update'] /* & { id: string } */, options?: UpdateOptions): void {
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
         if (options?.debug) console.log(`[🔴 DEBUG 🔴] UPDATING ${this.table.name}#${this.id}`)
         if (isSame) {
            if (options?.debug) console.log(`[🔴 DEBUG 🔴]✔️ ${this.table.name}#${this.id} no need to update`) // no need to update
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
            const ms = Number(B - A) / 1000000
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

   clone(t?: Partial<TABLE['$T']>): TABLE['$L'] {
      const cloneData = Object.assign(
         //
         {}, // receiving object
         toJS(this.data), // original object
         {
            // 2023-11-30 rvion: no need to set the createdAt and updatedAt
            // they'll be taken care of by the create functio below
            id: nanoid(), // overrides
            ...t,
         },
      )
      return this.table.create(cloneData)
   }

   delete(p: TABLE['$DeleteInstructions']): void {
      runInAction(() => {
         this.table.delete(this.data.id, p)
      })
   }

   toJSON(): TABLE['$T'] {
      return this.data
   }

   init(data_: TABLE['$T']): void {
      runInAction(() => {
         // console.log(`🔴 INIT`, data)
         /* 🚝 */ const startTime = process.hrtime()

         const data = this.dataObservabilityConfig //
            ? observable(data_, this.dataObservabilityConfig)
            : observable(data_)

         this.data = data

         // // prettier-ignore
         // /* 🔶 PERF HACK */ if (this.tableName === 'comfy_schema') {
         //     /* 🔶 PERF HACK */; (data as any as { spec: { a: 1; }; }).spec = observable.ref(
         //     /* 🔶 PERF HACK */(data as any as { spec: { a: 1; }; }).spec,
         //         /* 🔶 PERF HACK */ {},
         //         /* 🔶 PERF HACK */ { deep: false }
         //     );
         //     /* 🔶 PERF HACK */
         // }

         this.onHydrate?.(/* data */)
         this.onUpdate?.(undefined, data)
         /* 🚝 */ const endTime = process.hrtime(startTime)
         /* 🚝 */ const ms = endTime[1] / 1000000
         /* 🚝 */ quickBench.addStats(`init:${this.table.name}`, ms)
      })
   }

   log(...args: any[]): void {
      console.log(`[${this.table.emoji}] ${this.table.name}:`, ...args)
   }
}
