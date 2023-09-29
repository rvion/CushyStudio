import type { STATE } from '../front/state'

import { makeAutoObservable } from 'mobx'
import { LiveTable } from './LiveTable'

// models
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { AbsolutePath, RelativePath } from 'src/utils/fs/BrandedPaths'
import { DraftL, DraftT } from '../models/Draft'
import { FolderL, FolderT } from '../models/Folder'
import { GraphL, GraphT } from '../models/Graph'
import { ImageL, ImageT } from '../models/Image'
import { ProjectL, ProjectT } from '../models/Project'
import { PromptL, PromptT } from '../models/Prompt'
import { SchemaL, SchemaT } from '../models/Schema'
import { StepL, StepT } from '../models/Step'
import { ToolL, ToolT } from '../models/Tool'
import { asRelativePath } from '../utils/fs/pathUtils'
import { readableStringify } from '../utils/stringifyReadable'
import { LiveStore } from './LiveStore'

export type Indexed<T> = { [id: string]: T }

export class LiveDB {
    // live tables are expected to self register in this array
    // leave this lien at the top of the file
    _tables: LiveTable<any, any>[] = []

    relPath: RelativePath
    absPath: AbsolutePath

    // store ---------------------------------------------------------
    store: LiveStore = {}
    toJSON = (): LiveStore => this.store

    // tables ---------------------------------------------------------
    schemas: LiveTable<SchemaT, SchemaL>
    tools: LiveTable<ToolT, ToolL>
    folders: LiveTable<FolderT, FolderL>
    images: LiveTable<ImageT, ImageL>
    projects: LiveTable<ProjectT, ProjectL>
    drafts: LiveTable<DraftT, DraftL>
    steps: LiveTable<StepT, StepL>
    prompts: LiveTable<PromptT, PromptL>
    graphs: LiveTable<GraphT, GraphL>

    constructor(public st: STATE) {
        // 1. restore store if  it exists
        this.relPath = asRelativePath('./cushy.db')
        this.absPath = this.st.resolveFromRoot(this.relPath)
        const exists = existsSync(this.absPath)
        if (exists) {
            console.log(`[💿] DB: found db at "${this.absPath}"`)
        } else {
            console.log(`[💿] DB: creating db at "${this.absPath}"`)
        }
        try {
            if (exists) this.store = JSON.parse(readFileSync(this.absPath, 'utf8'))
        } catch (error) {
            console.log(readFileSync(this.absPath, 'utf8'))
            console.log(error)
        }

        // 2. make it observable
        makeAutoObservable(this)

        // 3. create tables (after the store has benn made already observable)
        this.schemas = new LiveTable(this, 'schemas', SchemaL, { singleton: true })
        this.tools = new LiveTable(this, 'tools', ToolL)
        this.folders = new LiveTable(this, 'folders', FolderL)
        this.images = new LiveTable(this, 'images', ImageL)
        this.projects = new LiveTable(this, 'projects', ProjectL, { singleton: true })
        this.steps = new LiveTable(this, 'steps', StepL)
        this.prompts = new LiveTable(this, 'prompts', PromptL)
        this.drafts = new LiveTable(this, 'drafts', DraftL)
        this.graphs = new LiveTable(this, 'graphs', GraphL)
        // this.msgs = new LiveTable(this, 'msgs', Foo)
    }

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
        return this.schemas.getOrCreate('main-schema', () => ({
            id: 'main-schema',
            embeddings: [],
            spec: {},
        }))
    }

    /* reset the whole DB (🔴?) */
    reset = () => {
        for (const table of this._tables) table.clear()
        this.markDirty()
    }
}
