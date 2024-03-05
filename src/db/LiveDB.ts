import type { STATE } from '../state/state'
import type * as T from 'src/db/TYPES.gen'
import type { TableInfo } from 'src/db/TYPES_json'

import BetterSqlite3, { default as SQL } from 'better-sqlite3'
import { rmSync } from 'fs'
import { makeAutoObservable } from 'mobx'

import { ComfyPromptL } from '../models/ComfyPrompt'
import { ComfySchemaL } from '../models/ComfySchema'
import { ComfyWorkflowL } from '../models/ComfyWorkflow'
import { DraftL } from '../models/Draft'
import { MediaImageL } from '../models/MediaImage'
import { ProjectL } from '../models/Project'
import { StepL } from '../models/Step'
import { DB_RELATIVE_PATH } from './DB_CONFIG'
import { LiveTable } from './LiveTable'
import { _applyAllMigrations } from 'src/db/_applyAllMigrations'
import { _codegenORM } from 'src/db/_codegenORM'
import { _setupMigrationEngine } from 'src/db/_setupMigrationEngine'
import { _checkAllMigrationsHaveDifferentIds } from 'src/db/migrations'
import { AuthL } from 'src/models/Auth'
import { CushyAppL } from 'src/models/CushyApp'
import { CushyScriptL } from 'src/models/CushyScript'
import { CustomDataL } from 'src/models/CustomData'
import { HostL } from 'src/models/Host'
import { Media3dDisplacementL } from 'src/models/Media3dDisplacement'
import { MediaSplatL } from 'src/models/MediaSplat'
import { MediaTextL } from 'src/models/MediaText'
import { MediaVideoL } from 'src/models/MediaVideo'
import { RuntimeErrorL } from 'src/models/RuntimeError'
import { TreeEntryL } from 'src/models/TreeEntry'

export type Indexed<T> = { [id: string]: T }

let ix = 0

export class LiveDB {
    _tables: LiveTable<any>[] = []

    // tables ---------------------------------------------------------
    projects:              LiveTable<T.TABLES['project']              > // prettier-ignore
    custom_datas:          LiveTable<T.TABLES['custom_data']          > // prettier-ignore
    comfy_schemas:         LiveTable<T.TABLES['comfy_schema']         > // prettier-ignore
    hosts:                 LiveTable<T.TABLES['host']                 > // prettier-ignore
    comfy_prompts:         LiveTable<T.TABLES['comfy_prompt']         > // prettier-ignore
    cushy_scripts:         LiveTable<T.TABLES['cushy_script']         > // prettier-ignore
    cushy_apps:            LiveTable<T.TABLES['cushy_app']            > // prettier-ignore
    media_texts:           LiveTable<T.TABLES['media_text']           > // prettier-ignore
    media_images:          LiveTable<T.TABLES['media_image']          > // prettier-ignore
    media_videos:          LiveTable<T.TABLES['media_video']          > // prettier-ignore
    media_splats:          LiveTable<T.TABLES['media_splat']          > // prettier-ignore
    media_3d_displacement: LiveTable<T.TABLES['media_3d_displacement']> // prettier-ignore
    tree_entries:          LiveTable<T.TABLES['tree_entry']           > // prettier-ignore
    runtimeErrors:         LiveTable<T.TABLES['runtime_error']        > // prettier-ignore
    drafts:                LiveTable<T.TABLES['draft']                > // prettier-ignore
    comfy_workflow:        LiveTable<T.TABLES['comfy_workflow']       > // prettier-ignore
    steps:                 LiveTable<T.TABLES['step']                 > // prettier-ignore
    auths:                 LiveTable<T.TABLES['auth']                 > // prettier-ignore

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
            this.projects =              new LiveTable<T.TABLES['project']              >(this, 'project'              , '🤠', ProjectL, { singleton: true })
            this.custom_datas =          new LiveTable<T.TABLES['custom_data']          >(this, 'custom_data'          , '🎁', CustomDataL)
            this.comfy_schemas =         new LiveTable<T.TABLES['comfy_schema']         >(this, 'comfy_schema'         , '📑', ComfySchemaL)
            this.hosts =                 new LiveTable<T.TABLES['host']                 >(this, 'host'                 , '📑', HostL)
            this.comfy_prompts =         new LiveTable<T.TABLES['comfy_prompt']         >(this, 'comfy_prompt'         , '❓', ComfyPromptL)
            this.cushy_scripts =         new LiveTable<T.TABLES['cushy_script']         >(this, 'cushy_script'         , '⭐️', CushyScriptL)
            this.cushy_apps =            new LiveTable<T.TABLES['cushy_app']            >(this, 'cushy_app'            , '🌟', CushyAppL)
            this.media_texts =           new LiveTable<T.TABLES['media_text']           >(this, 'media_text'           , '💬', MediaTextL)
            this.media_images =          new LiveTable<T.TABLES['media_image']          >(this, 'media_image'          , '🖼️', MediaImageL)
            this.media_videos =          new LiveTable<T.TABLES['media_video']          >(this, 'media_video'          , '🖼️', MediaVideoL)
            this.media_splats =          new LiveTable<T.TABLES['media_splat']          >(this, 'media_splat'          , '🖼️', MediaSplatL)
            this.media_3d_displacement = new LiveTable<T.TABLES['media_3d_displacement']>(this, 'media_3d_displacement', '🖼️', Media3dDisplacementL)
            this.tree_entries =          new LiveTable<T.TABLES['tree_entry']           >(this, 'tree_entry'           , '🖼️', TreeEntryL)
            this.runtimeErrors =         new LiveTable<T.TABLES['runtime_error']        >(this, 'runtime_error'        , '❌', RuntimeErrorL)
            this.drafts =                new LiveTable<T.TABLES['draft']                >(this, 'draft'                , '📝', DraftL)
            this.comfy_workflow =        new LiveTable<T.TABLES['comfy_workflow']       >(this, 'comfy_workflow'       , '📊', ComfyWorkflowL)
            this.steps =                 new LiveTable<T.TABLES['step']                 >(this, 'step'                 , '🚶‍♂️', StepL)
            this.auths =                 new LiveTable<T.TABLES['auth']                 >(this, 'auth'                 , '🚶‍♂️', AuthL)

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
                hydrater.hydrateJSONFields(val)
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
                hydrater.hydrateJSONFields(val)
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
            return (args: ARGS) => stmt.all(args).map((t) => hydrater.hydrateJSONFields(t)) as TI['$T'][]
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
