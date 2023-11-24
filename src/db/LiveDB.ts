import type { STATE } from '../state/state'

import { makeAutoObservable } from 'mobx'
import { LiveTable } from './LiveTable'

// models
import { existsSync, readFileSync, renameSync, rmSync, stat, writeFileSync } from 'fs'
import { extractErrorMessage } from 'src/utils/formatters/extractErrorMessage'
import { AbsolutePath, RelativePath } from 'src/utils/fs/BrandedPaths'
import { bytesToSize } from 'src/utils/fs/bytesToSize'
import { DraftL, DraftT } from '../models/Draft'
import { GraphL, GraphT } from '../models/Graph'
import { ImageL, ImageT } from '../models/Image'
import { ProjectL, ProjectT } from '../models/Project'
import { PromptL, PromptT } from '../models/Prompt'
import { SchemaL, SchemaT } from '../models/Schema'
import { StepL, StepT } from '../models/Step'
import { asRelativePath } from '../utils/fs/pathUtils'
import { readableStringify } from '../utils/formatters/stringifyReadable'
import { LiveStore, schemaVersion } from './LiveStore'

export type Indexed<T> = { [id: string]: T }

export class LiveDB {
    // live tables are expected to self register in this array
    // leave this lien at the top of the file
    _tables: LiveTable<any, any>[] = []

    relPath: RelativePath
    absPath: AbsolutePath

    // store ---------------------------------------------------------
    store: LiveStore
    toJSON = (): LiveStore => this.store
    mkNewStore = (): LiveStore => ({ schemaVersion: schemaVersion, models: {} })

    // tables ---------------------------------------------------------
    projects: LiveTable<ProjectT, ProjectL>
    schemas: LiveTable<SchemaT, SchemaL>
    prompts: LiveTable<PromptT, PromptL>
    images: LiveTable<ImageT, ImageL>
    drafts: LiveTable<DraftT, DraftL>
    graphs: LiveTable<GraphT, GraphL>
    steps: LiveTable<StepT, StepL>

    constructor(public st: STATE) {
        // 1. restore store if  it exists
        this.relPath = asRelativePath('./cushy2.db')
        this.absPath = this.st.resolveFromRoot(this.relPath)

        try {
            const exists = existsSync(this.absPath)
            if (exists) console.log(`[💿] DB: found db at "${this.absPath}"`)
            else console.log(`[💿] DB: creating db at "${this.absPath}"`)

            if (exists) {
                const prevStore = JSON.parse(readFileSync(this.absPath, 'utf8'))
                const prevVersion = prevStore.schemaVersion
                if (prevVersion != schemaVersion) {
                    const backupName = this.absPath + `${Date.now()}.db.backup`
                    console.log(`[💿] ❌ DB: schema version mismatch: expected ${schemaVersion}, got ${prevVersion}`)
                    console.log(`[💿] ❌ DB: backing up prev DB at ${backupName} and resetting the database`)
                    renameSync(this.absPath, backupName)
                    this.store = this.mkNewStore()
                } else {
                    this.store = prevStore
                }
            } else {
                this.store = this.mkNewStore()
            }
        } catch (error) {
            this.store = this.mkNewStore()
            console.log(readFileSync(this.absPath, 'utf8'))
            console.log(error)
        }

        // 2. make it observable
        makeAutoObservable(this)

        // 3. create tables (after the store has benn made already observable)
        this.projects = new LiveTable(this, 'projects', '🤠', ProjectL, { singleton: true })
        this.schemas = new LiveTable(this, 'schemas', '📑', SchemaL, { singleton: true })
        this.prompts = new LiveTable(this, 'prompts', '❓', PromptL)
        this.images = new LiveTable(this, 'images', '🖼️', ImageL)
        this.drafts = new LiveTable(this, 'drafts', '📝', DraftL)
        this.graphs = new LiveTable(this, 'graphs', '📊', GraphL)
        this.steps = new LiveTable(this, 'steps', '🚶‍♂️', StepL)

        this.startMonitoring()
    }

    // TODO: keep a count of dbsize and display on hover

    saveTimeout: Maybe<NodeJS.Timeout> = null
    markDirty = () => {
        if (this.saveTimeout != null) return

        this.saveTimeout = setTimeout(() => {
            console.log('[💿] DB saving...')
            const data = this.store
            // console.log('saving', data)
            writeFileSync(this.absPath, readableStringify(data, 3))
            this.saveTimeout = null
        }, 400)
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
    erase = () => {
        rmSync(this.absPath)
    }

    /* reset the whole DB */
    reset = () => {
        for (const table of this._tables) table.clear()
        this.markDirty()
    }

    /** self-updating DB size and health */
    health: { status: 'good' | 'meh' | 'bad'; size: number; sizeTxt: string } = { status: 'meh', size: 0, sizeTxt: '?' }

    get healthColor() {
        if (this.health.status === 'bad') return `btn-error`
        if (this.health.status === 'meh') return 'btn-warning'
        return null
    }
    private startMonitoring = () => {
        const store = this.st.hotReloadPersistentCache
        if (store.dbSizeWatcherInterval != null) clearInterval(store.dbSizeWatcherInterval)
        const updateDBSize = () => {
            // get file size using fs
            stat(this.absPath, (err, stats) => {
                if (err) return console.log(`❌ impossible to update db size: ${extractErrorMessage(err)}`, err)
                const size = stats.size
                const status = size > 30_000_000 ? 'bad' : size > 10_000_000 ? 'meh' : 'good'
                const sizeTxt = bytesToSize(size)
                this.health = { status, size, sizeTxt }
            })
        }
        store.dbSizeWatcherInterval = setInterval(updateDBSize, 2_000)
        updateDBSize()
    }
}
