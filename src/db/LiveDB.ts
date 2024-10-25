import type { Timestamp } from '../csuite/types/Timestamp'
import type { LiveTable } from './LiveTable'
import type * as T from './TYPES.gen'
import type { TableInfo } from './TYPES_json'
import type BetterSqlite3 from 'better-sqlite3'

import SQL from 'better-sqlite3'
import { rmSync } from 'fs'
import { makeAutoObservable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { AuthRepo } from '../models/Auth'
import { ComfyPromptRepo } from '../models/ComfyPrompt'
import { ComfySchemaRepo } from '../models/ComfySchema'
import { ComfyWorkflowRepo } from '../models/ComfyWorkflow'
import { CushyAppRepo } from '../models/CushyApp'
import { CushyScriptRepo } from '../models/CushyScript'
import { CustomDataRepo } from '../models/CustomData'
import { DraftRepo } from '../models/Draft'
import { HostRepo } from '../models/Host'
import { Media3dDisplacementRepo } from '../models/Media3dDisplacement'
import { MediaCustomRepo } from '../models/MediaCustom'
import { MediaImageRepo } from '../models/MediaImage'
import { MediaSplatRepo } from '../models/MediaSplat'
import { MediaTextRepo } from '../models/MediaText'
import { MediaVideoRepo } from '../models/MediaVideo'
import { PerspectiveRepo } from '../models/Perspective'
import { ProjectRepo } from '../models/Project'
import { RuntimeErrorRepo } from '../models/RuntimeError'
import { StepRepo } from '../models/Step'
import { TreeEntryRepo } from '../models/TreeEntry'
import { _applyAllMigrations } from './_applyAllMigrations'
import { _codegenORM } from './_codegenORM'
import { _setupMigrationEngine } from './_setupMigrationEngine'
import { DB_RELATIVE_PATH } from './DB_CONFIG'
import { _checkAllMigrationsHaveDifferentIds } from './migrations'
import { liveDBSubKeys } from './TYPES.gen'

export type Indexed<T> = { [id: string]: T }

let ix = 0

export class LiveDB {
   _tables: LiveTable<any, any>[] = []

   keys = new Map<T.LiveDBSubKeys, Timestamp>(
      [...liveDBSubKeys.values()].map((k) => [k, 0] as [T.LiveDBSubKeys, Timestamp]),
   )

   bump = (t: T.LiveDBSubKeys): void => {
      runInAction(() => {
         if (!liveDBSubKeys.has(t)) throw new Error('🔴 (bump) unknown LiveDBSubKeys: ' + t)
         else this.keys.set(t, Date.now() as Timestamp)
      })
   }

   subscribeToKeys = (keys: T.LiveDBSubKeys[]): void => {
      const tables = new Set(keys.map((k) => (k.split('.')[0] + '.id') as T.LiveDBSubKeys))
      for (const k1 of tables) this.subscribeToKey(k1)
      for (const k2 of keys) this.subscribeToKey(k2)
   }

   /**
    * this functions seems like it does nothing,
    * but it just subscribe through mobx to keys.
    * */
   subscribeToKey = (key: T.LiveDBSubKeys): void => {
      if (!liveDBSubKeys.has(key)) throw new Error('🔴 (subscribe) unknown LiveDBSubKeys: ' + key)
      this.keys.get(key)
   }

   // tables ---------------------------------------------------------
   project: ProjectRepo
   perspective: PerspectiveRepo
   custom_data: CustomDataRepo
   comfy_schema: ComfySchemaRepo
   host: HostRepo
   comfy_prompt: ComfyPromptRepo
   cushy_script: CushyScriptRepo
   cushy_app: CushyAppRepo
   media_text: MediaTextRepo
   media_image: MediaImageRepo
   media_video: MediaVideoRepo
   media_splat: MediaSplatRepo
   media_3d_displacement: Media3dDisplacementRepo
   media_custom: MediaCustomRepo
   tree_entry: TreeEntryRepo
   runtime_error: RuntimeErrorRepo
   draft: DraftRepo
   comfy_workflow: ComfyWorkflowRepo
   step: StepRepo
   auth: AuthRepo

   /** run all pending migrations */
   migrate = (): void => {
      _checkAllMigrationsHaveDifferentIds()
      _applyAllMigrations(this)
   }

   /** You should not call that unless you know what you're doing */
   runCodegen = (): void => _codegenORM(this)

   _uid = nanoid()
   constructor() {
      // init SQLITE ---------------------------------------------------------
      const db = SQL(DB_RELATIVE_PATH, {
         nativeBinding: 'node_modules/better-sqlite3/build/Release/better_sqlite3.node',
      })
      db.pragma('journal_mode = WAL')
      this.db = db

      // ------------------------------
      ;(window as any).db = this
      // ------------------------------

      _setupMigrationEngine(this)
      this.migrate()
      // _listAllTables(this)

      // ---------------------------------------------------------

      // 3. create tables (after the store has benn made already observable)
      this.project = new ProjectRepo(this)
      this.perspective = new PerspectiveRepo(this)
      this.custom_data = new CustomDataRepo(this)
      this.comfy_schema = new ComfySchemaRepo(this)
      this.host = new HostRepo(this)
      this.comfy_prompt = new ComfyPromptRepo(this)
      this.cushy_script = new CushyScriptRepo(this)
      this.cushy_app = new CushyAppRepo(this)
      this.media_text = new MediaTextRepo(this)
      this.media_image = new MediaImageRepo(this)
      this.media_video = new MediaVideoRepo(this)
      this.media_splat = new MediaSplatRepo(this)
      this.media_3d_displacement = new Media3dDisplacementRepo(this)
      this.media_custom = new MediaCustomRepo(this)
      this.tree_entry = new TreeEntryRepo(this)
      this.runtime_error = new RuntimeErrorRepo(this)
      this.draft = new DraftRepo(this)
      this.comfy_workflow = new ComfyWorkflowRepo(this)
      this.step = new StepRepo(this)
      this.auth = new AuthRepo(this)

      // console.log('🟢 TABLE INITIALIZED')
      makeAutoObservable(this)
   }

   rawAll(sql: string): void {
      const res = this.db.prepare(sql).all()
      console.log(`[=]>`, res)
   }

   rawExec(sql: string): void {
      const res = this.db.exec(sql)
      console.log(`[=]>`, res)
   }

   _getSize = (tableName: string): number => {
      // 1️⃣ https://github.com/WiseLibs/better-sqlite3/pull/1226 (allow modern electron)
      // 2️⃣ https://github.com/WiseLibs/better-sqlite3/pull/1228 (allow size)
      const stmt = this.db.prepare(`SELECT SUM("pgsize") as size FROM "dbstat" WHERE name='${tableName}';`)
      const out = stmt.get() as { size: number }
      return out.size
   }

   _getCount = (tabeName: string): number => {
      const stmt = this.db.prepare(`select count(id) as count from ${tabeName}`)
      return (stmt.get() as { count: number }).count
   }

   /** takes an  */
   compileSelectOne = <T, TI extends TableInfo>(
      //
      hydrater: TI,
      sql: string,
   ) => {
      try {
         const stmt = this.db.prepare(sql)
         return (args: T): Maybe<TI['$T']> => {
            const val = stmt.get(args) as Maybe<TI['$T']>
            if (val == null) return null
            hydrater.hydrateJSONFields_crashOnMissingData(val)
            return val
         }
      } catch (e) {
         console.log(sql)
         throw e
      }
   }
   compileSelectOne_ = <TI extends TableInfo>( //
      hydrater: TI,
      sql: string,
   ) => {
      try {
         const stmt = this.db.prepare(sql)
         return (): Maybe<TI['$T']> => {
            const val = stmt.get() as Maybe<TI['$T']>
            if (val == null) return null
            hydrater.hydrateJSONFields_crashOnMissingData(val)
            return val
         }
      } catch (e) {
         console.log(sql)
         throw e
      }
   }
   compileSelectMany = <ARGS, TI extends TableInfo>(
      //
      hydrater: TI,
      sql: string,
   ): ((args: ARGS) => TI['$T'][]) => {
      try {
         const stmt = this.db.prepare(sql)
         return (args: ARGS) =>
            stmt.all(args).map((t) => hydrater.hydrateJSONFields_crashOnMissingData(t)) as TI['$T'][]
      } catch (e) {
         console.log(sql)
         throw e
      }
   }

   compileDelete = <T, R>(sql: string) => {
      const stmt = this.db.prepare(sql)
      return (args: T): R => stmt.run(args) as R
   }

   // ------------------------------------------------------------------------------------
   log = (...res: any[]): void => console.log(`{${ix++}}`, ...res)
   db: BetterSqlite3.Database

   /* erase the DB file on disk */
   reset = (): void => this.erase()

   /* erase the DB file on disk */
   erase = (): void => {
      this.db.close()
      rmSync(DB_RELATIVE_PATH)
   }
}

export const liveDB = new LiveDB()
