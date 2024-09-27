import type { Timestamp } from '../csuite/types/Timestamp'
import type { STATE } from '../state/state'
import type * as T from './TYPES.gen'
import type { TableInfo } from './TYPES_json'

import BetterSqlite3, { default as SQL } from 'better-sqlite3'
import { rmSync } from 'fs'
import { makeAutoObservable, runInAction } from 'mobx'

import { AuthRepo } from '../models/Auth'
import { ComfyPromptL } from '../models/ComfyPrompt'
import { ComfySchemaL } from '../models/ComfySchema'
import { ComfyWorkflowL } from '../models/ComfyWorkflow'
import { CushyAppL } from '../models/CushyApp'
import { CushyScriptL } from '../models/CushyScript'
import { CustomDataRepo } from '../models/CustomData'
import { DraftL } from '../models/Draft'
import { HostL } from '../models/Host'
import { Media3dDisplacementL } from '../models/Media3dDisplacement'
import { MediaCustomL } from '../models/MediaCustom'
import { MediaImageL } from '../models/MediaImage'
import { MediaSplatL } from '../models/MediaSplat'
import { MediaTextL } from '../models/MediaText'
import { MediaVideoL } from '../models/MediaVideo'
import { ProjectL } from '../models/Project'
import { RuntimeErrorL } from '../models/RuntimeError'
import { StepRepo } from '../models/Step'
import { TreeEntryL } from '../models/TreeEntry'
import { _applyAllMigrations } from './_applyAllMigrations'
import { _codegenORM } from './_codegenORM'
import { _setupMigrationEngine } from './_setupMigrationEngine'
import { DB_RELATIVE_PATH } from './DB_CONFIG'
import { LiveTable } from './LiveTable'
import { _checkAllMigrationsHaveDifferentIds } from './migrations'
import { liveDBSubKeys } from './TYPES.gen'

export type Indexed<T> = { [id: string]: T }

let ix = 0

export class LiveDB {
    _tables: LiveTable<any, any>[] = []

    keys = new Map<T.LiveDBSubKeys, Timestamp>([...liveDBSubKeys.values()].map((k) => [k, 0] as [T.LiveDBSubKeys, Timestamp]))

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
    project:               LiveTable<T.TABLES['project']              , typeof ProjectL            > // prettier-ignore
    custom_data: CustomDataRepo
    comfy_schema:          LiveTable<T.TABLES['comfy_schema']         , typeof ComfySchemaL        > // prettier-ignore
    host:                  LiveTable<T.TABLES['host']                 , typeof HostL               > // prettier-ignore
    comfy_prompt:          LiveTable<T.TABLES['comfy_prompt']         , typeof ComfyPromptL        > // prettier-ignore
    cushy_script:          LiveTable<T.TABLES['cushy_script']         , typeof CushyScriptL        > // prettier-ignore
    cushy_app:             LiveTable<T.TABLES['cushy_app']            , typeof CushyAppL           > // prettier-ignore
    media_text:            LiveTable<T.TABLES['media_text']           , typeof MediaTextL          > // prettier-ignore
    media_image:           LiveTable<T.TABLES['media_image']          , typeof MediaImageL         > // prettier-ignore
    media_video:           LiveTable<T.TABLES['media_video']          , typeof MediaVideoL         > // prettier-ignore
    media_splat:           LiveTable<T.TABLES['media_splat']          , typeof MediaSplatL         > // prettier-ignore
    media_3d_displacement: LiveTable<T.TABLES['media_3d_displacement'], typeof Media3dDisplacementL> // prettier-ignore
    media_custom:          LiveTable<T.TABLES['media_custom']         , typeof MediaCustomL        > // prettier-ignore
    tree_entry:            LiveTable<T.TABLES['tree_entry']           , typeof TreeEntryL          > // prettier-ignore
    runtime_error:         LiveTable<T.TABLES['runtime_error']        , typeof RuntimeErrorL       > // prettier-ignore
    draft:                 LiveTable<T.TABLES['draft']                , typeof DraftL              > // prettier-ignore
    comfy_workflow:        LiveTable<T.TABLES['comfy_workflow']       , typeof ComfyWorkflowL      > // prettier-ignore
    step: StepRepo
    auth: AuthRepo

    /** run all pending migrations */
    migrate = (): void => {
        _checkAllMigrationsHaveDifferentIds()
        _applyAllMigrations(this)
    }

    /** You should not call that unless you know what you're doing */
    runCodegen = (): void => _codegenORM(this)

    // prettier-ignore
    constructor(public st: STATE) {
            // init SQLITE ---------------------------------------------------------
            const db = SQL(DB_RELATIVE_PATH, { nativeBinding: 'node_modules/better-sqlite3/build/Release/better_sqlite3.node' })
            db.pragma('journal_mode = WAL')
            this.db = db
            _setupMigrationEngine(this)
            this.migrate()
            // _listAllTables(this)

            // ---------------------------------------------------------
            makeAutoObservable(this)

            // 3. create tables (after the store has benn made already observable)
            this.project =               new LiveTable<T.TABLES['project']              , typeof ProjectL            >(this, 'project'              , '🤠', ProjectL, { singleton: true })
            this.custom_data =           new CustomDataRepo(this)
            this.comfy_schema =          new LiveTable<T.TABLES['comfy_schema']         , typeof ComfySchemaL        >(this, 'comfy_schema'         , '📑', ComfySchemaL)
            this.host =                  new LiveTable<T.TABLES['host']                 , typeof HostL               >(this, 'host'                 , '📑', HostL)
            this.comfy_prompt =          new LiveTable<T.TABLES['comfy_prompt']         , typeof ComfyPromptL        >(this, 'comfy_prompt'         , '❓', ComfyPromptL)
            this.cushy_script =          new LiveTable<T.TABLES['cushy_script']         , typeof CushyScriptL        >(this, 'cushy_script'         , '⭐️', CushyScriptL)
            this.cushy_app =             new LiveTable<T.TABLES['cushy_app']            , typeof CushyAppL           >(this, 'cushy_app'            , '🌟', CushyAppL)
            this.media_text =            new LiveTable<T.TABLES['media_text']           , typeof MediaTextL          >(this, 'media_text'           , '💬', MediaTextL)
            this.media_image =           new LiveTable<T.TABLES['media_image']          , typeof MediaImageL         >(this, 'media_image'          , '🖼️', MediaImageL)
            this.media_video =           new LiveTable<T.TABLES['media_video']          , typeof MediaVideoL         >(this, 'media_video'          , '🖼️', MediaVideoL)
            this.media_splat =           new LiveTable<T.TABLES['media_splat']          , typeof MediaSplatL         >(this, 'media_splat'          , '🖼️', MediaSplatL)
            this.media_3d_displacement = new LiveTable<T.TABLES['media_3d_displacement'], typeof Media3dDisplacementL>(this, 'media_3d_displacement', '🖼️', Media3dDisplacementL)
            this.media_custom =          new LiveTable<T.TABLES['media_custom']         , typeof MediaCustomL        >(this, 'media_custom'         , '🖼️', MediaCustomL)
            this.tree_entry =            new LiveTable<T.TABLES['tree_entry']           , typeof TreeEntryL          >(this, 'tree_entry'           , '🖼️', TreeEntryL)
            this.runtime_error =         new LiveTable<T.TABLES['runtime_error']        , typeof RuntimeErrorL       >(this, 'runtime_error'        , '❌', RuntimeErrorL)
            this.draft =                 new LiveTable<T.TABLES['draft']                , typeof DraftL              >(this, 'draft'                , '📝', DraftL)
            this.comfy_workflow =        new LiveTable<T.TABLES['comfy_workflow']       , typeof ComfyWorkflowL      >(this, 'comfy_workflow'       , '📊', ComfyWorkflowL)
            this.step =                  new StepRepo(this)
            this.auth =                  new AuthRepo(this)

            // console.log('🟢 TABLE INITIALIZED')
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
            return (args: ARGS) => stmt.all(args).map((t) => hydrater.hydrateJSONFields_crashOnMissingData(t)) as TI['$T'][]
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
