import type { STATE } from '../state/state'
import type { TableInfo } from 'src/db/TYPES_json'
import type {
    ComfyPromptT,
    ComfySchemaT,
    CustomDataT,
    DraftT,
    GraphT,
    Media3dDisplacementT,
    MediaImageT,
    MediaSplatT,
    MediaTextT,
    MediaVideoT,
    ProjectT,
    RuntimeErrorT,
    StepT,
} from 'src/db/TYPES.gen'

import { rmSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { LiveTable } from './LiveTable'
import { default as BetterSqlite3, default as SQL } from 'better-sqlite3'
// models
import { readFileSync } from 'fs'
import { _applyAllMigrations } from 'src/db/_applyAllMigrations'
import { _setupMigrationEngine } from 'src/db/_setupMigrationEngine'
import { _listAllTables } from 'src/db/_listAllTables'
import { _checkAllMigrationsHaveDifferentIds } from 'src/db/migrations'
import { Media3dDisplacementL } from 'src/models/Media3dDisplacement'
import { MediaTextL } from 'src/models/MediaText'
import { MediaVideoL } from 'src/models/MediaVideo'
import { RuntimeErrorL } from 'src/models/RuntimeError'
import { ComfyPromptL } from '../models/ComfyPrompt'
import { DraftL } from '../models/Draft'
import { ComfyWorkflowL } from '../models/Graph'
import { MediaImageL } from '../models/MediaImage'
import { ProjectL } from '../models/Project'
import { SchemaL } from '../models/Schema'
import { StepL } from '../models/Step'
import { asRelativePath } from '../utils/fs/pathUtils'
import { _printSchema } from 'src/db/_printSchema'
import { MediaSplatL } from 'src/models/MediaSplat'
import { CustomDataL } from 'src/models/CustomData'
import { DB_RELATIVE_PATH } from './DB_CONFIG'

export type Indexed<T> = { [id: string]: T }

let ix = 0

export class LiveDB {
    _tables: LiveTable<any, any>[] = []

    // tables ---------------------------------------------------------
    projects: LiveTable<ProjectT, ProjectL>
    custom_datas: LiveTable<CustomDataT, CustomDataL>
    schemas: LiveTable<ComfySchemaT, SchemaL>
    comfy_prompts: LiveTable<ComfyPromptT, ComfyPromptL>
    media_texts: LiveTable<MediaTextT, MediaTextL>
    media_images: LiveTable<MediaImageT, MediaImageL>
    media_videos: LiveTable<MediaVideoT, MediaVideoL>
    media_splats: LiveTable<MediaSplatT, MediaSplatL>
    media_3d_displacement: LiveTable<Media3dDisplacementT, Media3dDisplacementL>
    runtimeErrors: LiveTable<RuntimeErrorT, RuntimeErrorL>
    drafts: LiveTable<DraftT, DraftL>
    graphs: LiveTable<GraphT, ComfyWorkflowL>
    steps: LiveTable<StepT, StepL>

    /** run all pending migrations */
    migrate = () => {
        _checkAllMigrationsHaveDifferentIds()
        _applyAllMigrations(this)
    }

    /** You should not call that unless you know what you're doing */
    runCodegen = () => {
        _printSchema(this)
    }

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
            this.projects =              new LiveTable(this, 'project'              , '🤠', ProjectL, { singleton: true })
            this.custom_datas =          new LiveTable(this, 'custom_data'          , '🎁', CustomDataL)
            this.schemas =               new LiveTable(this, 'comfy_schema'         , '📑', SchemaL, { singleton: true })
            this.comfy_prompts =         new LiveTable(this, 'comfy_prompt'         , '❓', ComfyPromptL)
            this.media_texts =           new LiveTable(this, 'media_text'           , '💬', MediaTextL)
            this.media_images =          new LiveTable(this, 'media_image'          , '🖼️', MediaImageL)
            this.media_videos =          new LiveTable(this, 'media_video'          , '🖼️', MediaVideoL)
            this.media_splats =          new LiveTable(this, 'media_splat'          , '🖼️', MediaSplatL)
            this.media_3d_displacement = new LiveTable(this, 'media_3d_displacement', '🖼️', Media3dDisplacementL)
            this.runtimeErrors =         new LiveTable(this, 'runtime_error'        , '❌', RuntimeErrorL)
            this.drafts =                new LiveTable(this, 'draft'                , '📝', DraftL)
            this.graphs =                new LiveTable(this, 'graph'                , '📊', ComfyWorkflowL)
            this.steps =                 new LiveTable(this, 'step'                 , '🚶‍♂️', StepL)

            console.log('🟢 TABLE INITIALIZED')
        }

    _getCount = (tabeName: string): number => {
        const stmt = this.db.prepare(`select count(id) as count from ${tabeName}`)
        return (stmt.get() as { count: number }).count
    }

    prepareGet = <T, R>(info: TableInfo<R>, sql: string) => {
        try {
            const stmt = this.db.prepare(sql)
            return (args: T): Maybe<R> => {
                const val = stmt.get(args) as Maybe<R>
                if (val == null) return null
                info.hydrateJSONFields(val)
                return val
            }
        } catch (e) {
            console.log(sql)
            throw e
        }
    }
    prepareGet0 = <R>(info: TableInfo<R>, sql: string) => {
        try {
            const stmt = this.db.prepare(sql)
            return (): Maybe<R> => {
                const val = stmt.get() as Maybe<R>
                if (val == null) return null
                info.hydrateJSONFields(val)
                return val
            }
        } catch (e) {
            console.log(sql)
            throw e
        }
    }
    prepareAll = <T, R>(info: TableInfo<R>, sql: string) => {
        try {
            const stmt = this.db.prepare(sql)
            return (args: T) => stmt.all(args).map((t) => info.hydrateJSONFields(t)) as R[]
        } catch (e) {
            console.log(sql)
            throw e
        }
    }

    prepareDelete = <T, R>(sql: string) => {
        const stmt = this.db.prepare(sql)
        return (args: T) => stmt.run(args) as R
    }

    log = (...res: any[]) => console.log(`{${ix++}}`, ...res)
    db: BetterSqlite3.Database

    // misc ---------------------------------------------------------
    get schema(): SchemaL {
        return this.schemas.getOrCreate('main-schema', () => {
            const objectInfoDefaultPath = this.st.resolve(this.st.rootPath, asRelativePath('schema/object_info.default.json'))
            const objectInfoDefault = JSON.parse(readFileSync(objectInfoDefaultPath, 'utf8'))
            console.log('🟢 generating new schma')
            return {
                id: 'main-schema',
                embeddings: [],
                spec: objectInfoDefault,
            }
        })
    }

    /* erase the DB file on disk */
    reset = () => this.erase()
    /* erase the DB file on disk */
    erase = () => {
        this.db.close()
        rmSync(DB_RELATIVE_PATH)
    }
}
