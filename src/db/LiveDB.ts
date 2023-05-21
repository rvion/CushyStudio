import * as mobx from 'mobx'
import * as Y from 'yjs'

import { nanoid } from 'nanoid'
import { ProjectL, ProjectT } from '../models/Project'
import { StepL, StepT } from '../models/Step'
import type * as W2 from 'y-websocket/'
import { SchemaL, SchemaT } from '../core/Schema'
import { ActionL, ActionT } from '../models/Action'
import { FolderL, FolderT } from '../models/Folder'
import { Foo } from '../models/Foo'
import { ImageL, ImageT } from '../models/Image'
import { LiveTable } from './LiveTable'

export class LiveDB {
    wsProvider: W2.WebsocketProvider
    obs: any = mobx.observable({})
    doc: Y.Doc
    store

    // -----------------------------------
    get config() {
        return this.store.config.getOrCreate('config', () => ({ id: 'config' }))
    }
    get schema(): SchemaL {
        return this.store.schema.getOrCreate('schema', () => ({ id: 'schema', embeddings: [], spec: {} }))
    }
    get images() {return this.store.images} // prettier-ignore
    get folders() {return this.store.folders} // prettier-ignore
    get msgs() {return this.store.msgs} // prettier-ignore
    get actions():LiveTable< ActionT,ActionL> {return this.store.actions} // prettier-ignore
    get projects() {return this.store.projects} // prettier-ignore
    get steps():LiveTable< StepT,StepL> {return this.store.steps} // prettier-ignore
    get status() {return this.store.status} // prettier-ignore
    // -----------------------------------

    /* reset the whole DB (🔴?) */
    reset = () => {
        Y.transact(this.doc, () => {
            for (const k in this.store) {
                const store: LiveTable<any, any> = (this.store as any)[k]
                store.clear()
            }
        })
    }

    constructor(p: {
        //
        WebsocketProvider: typeof W2.WebsocketProvider
        WebSocketPolyfill?: any
    }) {
        console.log('creating db', nanoid())
        this.doc = new Y.Doc({ autoLoad: true })
        this.wsProvider = new p.WebsocketProvider('ws://localhost:1234', 'test2', this.doc, {
            WebSocketPolyfill: p.WebSocketPolyfill,
            connect: true,
        })
        this.debug()
        this.store = {
            config: new LiveTable<{ id: string }, Foo>(this, 'config', Foo),
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
        }
    }

    disconnect = () => this.wsProvider.disconnect()
    connect = () => this.wsProvider.connect()
    debug = () => {
        this.wsProvider.on('status', (event: any) => console.log(`🐙`, event.status))
        this.wsProvider.on('connected', (event: any) => console.log(`🐙`, event.status))
        this.wsProvider.on('sync', (event: any) => console.log(`🐙 sync:`, event))
    }
}
