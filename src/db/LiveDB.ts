import type { STATE } from '../front/FrontState'
import type { Maybe } from '../utils/types'

import { makeAutoObservable } from 'mobx'
import { LiveTable } from './LiveTable'

// models
import { ActionL, ActionT } from '../models/Action'
import { ConfigL, ConfigT } from '../models/Config'
import { FolderL, FolderT } from '../models/Folder'
import { Foo } from '../models/Foo'
import { GraphL, GraphT } from '../models/Graph'
import { ImageL, ImageT } from '../models/Image'
import { ProjectL, ProjectT } from '../models/Project'
import { PromptL, PromptT } from '../models/Prompt'
import { SchemaL, SchemaT } from '../models/Schema'
import { StepL, StepT } from '../models/Step'
import { asRelativePath } from '../utils/fs/pathUtils'
import { AbsolutePath, RelativePath } from 'src/utils/fs/BrandedPaths'
import { exists, existsSync, readFileSync, writeFileSync } from 'fs'

export type Indexed<T> = { [id: string]: T }

export type STORE = {
    configs?: Indexed<ConfigT>
    schemas?: Indexed<SchemaT>
    statuses?: Indexed<{ id: string }>
    // ???
    msgs?: Indexed<{ id: string }>
    // global
    actions?: Indexed<ActionT>
    folders?: Indexed<FolderT>
    images?: Indexed<ImageT>
    // project
    projects?: Indexed<ProjectT>
    steps?: Indexed<StepT>
    prompts?: Indexed<PromptT>
    graphs?: Indexed<GraphT>
}

export class LiveDB {
    // live tables are expected to self register in this array
    // leave this lien at the top of the file
    _tables: LiveTable<any, any>[] = []

    relPath: RelativePath
    absPath: AbsolutePath

    constructor(public st: STATE) {
        this.relPath = asRelativePath('./cushy.db')
        console.log('relpath:', this.relPath)
        this.absPath = this.st.resolveFromRoot(this.relPath)
        console.log('abspath:', this.absPath)
        const exists = existsSync(this.absPath)
        if (exists) this.STORE = JSON.parse(readFileSync(this.absPath, 'utf8'))

        makeAutoObservable(this)
    }

    STORE: STORE = {}
    toJSON = (): STORE => this.STORE

    saveTimeout: Maybe<NodeJS.Timeout> = null
    save = () => {
        if (this.saveTimeout == null) return

        this.saveTimeout = setTimeout(() => {
            const data = this.STORE
            console.log('saving', data)
            writeFileSync(this.absPath, JSON.stringify(data))
            this.saveTimeout = null
        })
    }

    // tables ---------------------------------------------------------
    configs = new LiveTable<ConfigT, ConfigL>(this, 'configs', ConfigL)
    schemas = new LiveTable<SchemaT, SchemaL>(this, 'schemas', SchemaL)
    statuses = new LiveTable<{ id: string }, Foo>(this, 'status', Foo)
    // ???
    msgs = new LiveTable<{ id: string }, Foo>(this, 'msgs', Foo)
    // global
    actions = new LiveTable<ActionT, ActionL>(this, 'actions', ActionL)
    folders = new LiveTable<FolderT, FolderL>(this, 'folders', FolderL)
    images = new LiveTable<ImageT, ImageL>(this, 'images', ImageL)
    // project
    projects = new LiveTable<ProjectT, ProjectL>(this, 'projects', ProjectL)
    steps = new LiveTable<StepT, StepL>(this, 'steps', StepL)
    prompts = new LiveTable<PromptT, PromptL>(this, 'prompts', PromptL)
    graphs = new LiveTable<GraphT, GraphL>(this, 'graphs', GraphL)

    // misc ---------------------------------------------------------
    get config(): ConfigL {
        return this.configs.getOrCreate('main-config', () => ({ id: 'main-config' }))
    }
    get schema(): SchemaL {
        return this.schemas.getOrCreate('main-schema', () => ({ id: 'main-schema', embeddings: [], spec: {} }))
    }

    /* reset the whole DB (🔴?) */
    reset = () => {
        for (const table of this._tables) table.clear()
    }
}
