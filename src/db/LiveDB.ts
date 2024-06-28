import type { Timestamp } from '../csuite/types/Timestamp'
import type { STATE } from '../state/state'
import type * as T from './TYPES.gen'
import type { TableInfo } from './TYPES_json'

import BetterSqlite3, { default as SQL } from 'better-sqlite3'
import { rmSync } from 'fs'
import { makeAutoObservable } from 'mobx'

import { AuthL } from '../models/Auth'
import { ComfyPromptL } from '../models/ComfyPrompt'
import { ComfySchemaL } from '../models/ComfySchema'
import { ComfyWorkflowL } from '../models/ComfyWorkflow'
import { CushyAppL } from '../models/CushyApp'
import { CushyScriptL } from '../models/CushyScript'
import { CustomDataL } from '../models/CustomData'
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
import { StepL } from '../models/Step'
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
    _tables: LiveTable<any>[] = []

    keys = new Map<T.LiveDBSubKeys, Timestamp>([...liveDBSubKeys.values()].map((k) => [k, 0] as [T.LiveDBSubKeys, Timestamp]))
    bump = (t: T.LiveDBSubKeys) => {
        if (!liveDBSubKeys.has(t)) throw new Error('🔴 (bump) unknown LiveDBSubKeys: ' + t)
        else this.keys.set(t, Date.now() as Timestamp)
    }

    subscribeToKeys = (keys: T.LiveDBSubKeys[]) => {
        const tables = new Set(keys.map((k) => (k.split('.')[0] + '.id') as T.LiveDBSubKeys))
        for (const k1 of tables) this.subscribeToKey(k1)
        for (const k2 of keys) this.subscribeToKey(k2)
    }

    /**
     * this functions seems like it does nothing,
     * but it just subscribe through mobx to keys.
     * */
    subscribeToKey = (key: T.LiveDBSubKeys) => {
        if (!liveDBSubKeys.has(key)) throw new Error('🔴 (subscribe) unknown LiveDBSubKeys: ' + key)
        this.keys.get(key)
    }

    // tables ---------------------------------------------------------
    project:               LiveTable<T.TABLES['project']              > // prettier-ignore
    custom_data:           LiveTable<T.TABLES['custom_data']          > // prettier-ignore
    comfy_schema:          LiveTable<T.TABLES['comfy_schema']         > // prettier-ignore
    host:                  LiveTable<T.TABLES['host']                 > // prettier-ignore
    comfy_prompt:          LiveTable<T.TABLES['comfy_prompt']         > // prettier-ignore
    cushy_script:          LiveTable<T.TABLES['cushy_script']         > // prettier-ignore
    cushy_app:             LiveTable<T.TABLES['cushy_app']            > // prettier-ignore
    media_text:            LiveTable<T.TABLES['media_text']           > // prettier-ignore
    media_image:           LiveTable<T.TABLES['media_image']          > // prettier-ignore
    media_video:           LiveTable<T.TABLES['media_video']          > // prettier-ignore
    media_splat:           LiveTable<T.TABLES['media_splat']          > // prettier-ignore
    media_3d_displacement: LiveTable<T.TABLES['media_3d_displacement']> // prettier-ignore
    media_custom:        LiveTable<T.TABLES['media_custom']       > // prettier-ignore
    tree_entry:            LiveTable<T.TABLES['tree_entry']           > // prettier-ignore
    runtime_error:         LiveTable<T.TABLES['runtime_error']        > // prettier-ignore
    draft:                 LiveTable<T.TABLES['draft']                > // prettier-ignore
    comfy_workflow:        LiveTable<T.TABLES['comfy_workflow']       > // prettier-ignore
    step:                  LiveTable<T.TABLES['step']                 > // prettier-ignore
    auth:                  LiveTable<T.TABLES['auth']                 > // prettier-ignore

    /** run all pending migrations */
    migrate = () => {
        _checkAllMigrationsHaveDifferentIds()
        _applyAllMigrations(this)
    }

    /** You should not call that unless you know what you're doing */
    runCodegen = () => _codegenORM(this)

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
            this.project =               new LiveTable<T.TABLES['project']              >(this, 'project'              , '🤠', ProjectL, { singleton: true })
            this.custom_data =           new LiveTable<T.TABLES['custom_data']          >(this, 'custom_data'          , '🎁', CustomDataL)
            this.comfy_schema =          new LiveTable<T.TABLES['comfy_schema']         >(this, 'comfy_schema'         , '📑', ComfySchemaL)
            this.host =                  new LiveTable<T.TABLES['host']                 >(this, 'host'                 , '📑', HostL)
            this.comfy_prompt =          new LiveTable<T.TABLES['comfy_prompt']         >(this, 'comfy_prompt'         , '❓', ComfyPromptL)
            this.cushy_script =          new LiveTable<T.TABLES['cushy_script']         >(this, 'cushy_script'         , '⭐️', CushyScriptL)
            this.cushy_app =             new LiveTable<T.TABLES['cushy_app']            >(this, 'cushy_app'            , '🌟', CushyAppL)
            this.media_text =            new LiveTable<T.TABLES['media_text']           >(this, 'media_text'           , '💬', MediaTextL)
            this.media_image =           new LiveTable<T.TABLES['media_image']          >(this, 'media_image'          , '🖼️', MediaImageL)
            this.media_video =           new LiveTable<T.TABLES['media_video']          >(this, 'media_video'          , '🖼️', MediaVideoL)
            this.media_splat =           new LiveTable<T.TABLES['media_splat']          >(this, 'media_splat'          , '🖼️', MediaSplatL)
            this.media_3d_displacement = new LiveTable<T.TABLES['media_3d_displacement']>(this, 'media_3d_displacement', '🖼️', Media3dDisplacementL)
            this.media_custom =          new LiveTable<T.TABLES['media_custom']         >(this, 'media_custom'         , '🖼️', MediaCustomL)
            this.tree_entry =            new LiveTable<T.TABLES['tree_entry']           >(this, 'tree_entry'           , '🖼️', TreeEntryL)
            this.runtime_error =         new LiveTable<T.TABLES['runtime_error']        >(this, 'runtime_error'        , '❌', RuntimeErrorL)
            this.draft =                 new LiveTable<T.TABLES['draft']                >(this, 'draft'                , '📝', DraftL)
            this.comfy_workflow =        new LiveTable<T.TABLES['comfy_workflow']       >(this, 'comfy_workflow'       , '📊', ComfyWorkflowL)
            this.step =                  new LiveTable<T.TABLES['step']                 >(this, 'step'                 , '🚶‍♂️', StepL)
            this.auth =                  new LiveTable<T.TABLES['auth']                 >(this, 'auth'                 , '🚶‍♂️', AuthL)

            // console.log('🟢 TABLE INITIALIZED')
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
        return (args: T) => stmt.run(args) as R
    }

    // ------------------------------------------------------------------------------------
    log = (...res: any[]) => console.log(`{${ix++}}`, ...res)
    db: BetterSqlite3.Database

    /* erase the DB file on disk */
    reset = () => this.erase()

    /* erase the DB file on disk */
    erase = () => {
        this.db.close()
        rmSync(DB_RELATIVE_PATH)
    }
}
