import { default as BetterSqlite3, default as SQL } from 'better-sqlite3'
import { rmSync } from 'fs'
import type { STATE } from '../state/state'

import { makeAutoObservable } from 'mobx'
import { LiveTable } from './LiveTable'
import { DraftT, GraphT, MediaImageT, ProjectT, ComfyPromptT, ComfySchemaT, StepT } from 'src/db2/TYPES.gen'
// models
import { readFileSync } from 'fs'
import { Store } from 'src/db2/storage'
import { DraftL } from '../models/Draft'
import { GraphL } from '../models/Graph'
import { MediaImageL } from '../models/Image'
import { ProjectL } from '../models/Project'
import { PromptL } from '../models/Prompt'
import { SchemaL } from '../models/Schema'
import { StepL } from '../models/Step'
import { asRelativePath } from '../utils/fs/pathUtils'
import { _applyAllMigrations } from 'src/db2/_applyAllMigrations'
import { _createRootMig } from 'src/db2/_createRootMig'
import { _checkAllMigrationsHaveDifferentIds } from 'src/db2/migrations'
import { _listAllTables } from 'src/db2/_listAllTables'

export type Indexed<T> = { [id: string]: T }

let ix = 0

export class LiveDB {
    _tables: LiveTable<any, any>[] = []

    // tables ---------------------------------------------------------
    projects: LiveTable<ProjectT, ProjectL>
    schemas: LiveTable<ComfySchemaT, SchemaL>
    prompts: LiveTable<ComfyPromptT, PromptL>
    media_images: LiveTable<MediaImageT, MediaImageL>
    // media_texts: LiveTable<MediaTextT, MediaImageL>
    // media_video: LiveTable<MediaVideoT, MediaImageL>
    drafts: LiveTable<DraftT, DraftL>
    graphs: LiveTable<GraphT, GraphL>
    steps: LiveTable<StepT, StepL>

    _getCount = (tabeName: string): number => {
        const stmt = this.db.prepare(`select count(id) as count from ${tabeName}`)
        return (stmt.get() as { count: number }).count
    }

    prepareGet = <T, R>(sql: string) => {
        try {
            const stmt = this.db.prepare(sql)
            return (args: T) => stmt.get(args) as R
        } catch (e) {
            console.log(sql)
            throw e
        }
    }
    prepareAll = <T, R>(sql: string) => {
        try {
            const stmt = this.db.prepare(sql)
            return (args: T) => stmt.all(args) as R[]
        } catch (e) {
            console.log(sql)
            throw e
        }
    }

    prepareInsert = <T, R>(sql: string) => {
        try {
            const stmt = this.db.prepare(sql)
            return (args: T) => {
                if (Array.isArray(args)) throw new Error('insert does not support arrays')
                if (typeof args !== 'object') throw new Error('insert does not support non-objects')
                const insertPayload = Object.fromEntries(
                    Object.entries(args as any).map(([k, v]) => {
                        if (Array.isArray(v)) return [k, JSON.stringify(v)]
                        if (typeof v === 'object' && v != null) return [k, JSON.stringify(v) ?? 'null']
                        return [k, v]
                    }),
                )
                stmt.run(insertPayload) as R
            }
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

    // prettier-ignore
    constructor(public st: STATE) {
        // init SQLITE ---------------------------------------------------------
        const db = SQL('foobar.db', { nativeBinding: 'node_modules/better-sqlite3/build/Release/better_sqlite3.node' })
        db.pragma('journal_mode = WAL')
        this.db = db
        _createRootMig(this)
        _checkAllMigrationsHaveDifferentIds()
        _applyAllMigrations(this)
        _listAllTables(this)

        // ---------------------------------------------------------
        makeAutoObservable(this)

        // 3. create tables (after the store has benn made already observable)
        this.projects = new     LiveTable(this, 'project', '🤠', ProjectL, { singleton: true })
        this.schemas = new      LiveTable(this, 'comfy_schema', '📑', SchemaL, { singleton: true })
        this.prompts = new      LiveTable(this, 'comfy_prompt', '❓', PromptL)
        this.media_images = new LiveTable(this, 'media_image', '🖼️', MediaImageL)
        this.drafts = new       LiveTable(this, 'draft', '📝', DraftL)
        this.graphs = new       LiveTable(this, 'graph', '📊', GraphL)
        this.steps = new        LiveTable(this, 'step', '🚶‍♂️', StepL)
    }

    // misc ---------------------------------------------------------
    get schema(): SchemaL {
        return this.schemas.getOrCreate('main-schema', () => {
            const objectInfoDefaultPath = this.st.resolve(this.st.rootPath, asRelativePath('schema/object_info.default.json'))
            const objectInfoDefault = JSON.parse(readFileSync(objectInfoDefaultPath, 'utf8'))
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
        rmSync('foobar.db')
    }
}
