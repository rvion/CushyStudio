import type * as W2 from 'y-websocket/'

import { Foo } from '../models/Foo'
import { LiveTable } from './LiveTable'

// models
import { ActionL, ActionT } from '../models/Action'
import { ConfigL, ConfigT } from '../models/Config'
import { FolderL, FolderT } from '../models/Folder'
import { GraphL, GraphT } from '../models/Graph'
import { ImageL, ImageT } from '../models/Image'
import { ProjectL, ProjectT } from '../models/Project'
import { PromptL, PromptT } from '../models/Prompt'
import { SchemaL, SchemaT } from '../models/Schema'
import { StepL, StepT } from '../models/Step'
import { makeAutoObservable, observable } from 'mobx'

export class LiveDB {
    // wsProvider: W2.WebsocketProvider
    obs: any = observable({})
    store

    // -----------------------------------
    get config(): ConfigL {
        return this.store.config.getOrCreate('config', () => ({ id: 'config' }))
    }
    get schema(): SchemaL {
        return this.store.schema.getOrCreate('schema', () => ({ id: 'schema', embeddings: [], spec: {} }))
    }
    get images() {return this.store.images} // prettier-ignore
    get folders() {return this.store.folders} // prettier-ignore
    get msgs() {return this.store.msgs} // prettier-ignore
    get actions():LiveTable< ActionT,ActionL> {return this.store.actions} // prettier-ignore
    get prompts():LiveTable< PromptT,PromptL> {return this.store.prompts} // prettier-ignore
    get projects() {return this.store.projects} // prettier-ignore
    get graphs() {return this.store.graphs} // prettier-ignore
    get steps():LiveTable< StepT,StepL> {return this.store.steps} // prettier-ignore
    get status() {return this.store.status} // prettier-ignore
    // -----------------------------------

    /* reset the whole DB (🔴?) */
    reset = () => {
        for (const k in this.store) {
            const store: LiveTable<any, any> = (this.store as any)[k]
            store.clear()
        }
    }

    constructor() {
        this.store = {
            config: new LiveTable<ConfigT, ConfigL>(this, 'config', ConfigL),
            schema: new LiveTable<SchemaT, SchemaL>(this, 'schema', SchemaL),
            status: new LiveTable<{ id: string }, Foo>(this, 'status', Foo),
            // ???
            msgs: new LiveTable<{ id: string }, Foo>(this, 'msgs', Foo),
            // global
            actions: new LiveTable<ActionT, ActionL>(this, 'actions', ActionL),
            folders: new LiveTable<FolderT, FolderL>(this, 'folders', FolderL),
            images: new LiveTable<ImageT, ImageL>(this, 'images', ImageL),
            // project
            projects: new LiveTable<ProjectT, ProjectL>(this, 'projects', ProjectL),
            steps: new LiveTable<StepT, StepL>(this, 'steps', StepL),
            prompts: new LiveTable<PromptT, PromptL>(this, 'prompts', PromptL),
            graphs: new LiveTable<GraphT, GraphL>(this, 'graphs', GraphL),
        }
        makeAutoObservable(this)
    }
}
