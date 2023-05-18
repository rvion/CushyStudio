import * as mobx from 'mobx'
import * as Y from 'yjs'

import { nanoid } from 'nanoid'
import * as W from 'y-websocket'
import { LiveTable } from './LiveTable'
import { FolderL, FolderT } from '../models/Folder'
import { ImageL, ImageT } from '../models/Image'
import { Foo } from '../models/Foo'

// enableMobxBindings(mobx)

export class LiveDB {
    // -----------------------------------
    get config() { return this.store.config.getOrCreate('config', () => ({ id: 'config' })) } // prettier-ignore
    get schema() { return this.store.schema.getOrCreate('schema', () => ({ id: 'schema' })) } // prettier-ignore
    get files() {return this.store.images} // prettier-ignore
    get folders() {return this.store.folders} // prettier-ignore
    get msgs() {return this.store.msgs} // prettier-ignore
    get scopes() {return this.store.scopes} // prettier-ignore
    get actions() {return this.store.actions} // prettier-ignore
    get status() {return this.store.status} // prettier-ignore
    // -----------------------------------

    doc: Y.Doc
    wsProvider: W.WebsocketProvider
    store
    obs: any = mobx.observable({})

    constructor(p: { WebSocketPolyfill?: any }) {
        console.log('creating db', nanoid())
        this.doc = new Y.Doc({ autoLoad: true })
        this.wsProvider = new W.WebsocketProvider('ws://localhost:1234', 'test2', this.doc, {
            WebSocketPolyfill: p.WebSocketPolyfill,
            connect: true,
        })
        this.debug()
        this.store = {
            config: new LiveTable<{ id: string }, Foo>(this, 'config', Foo),
            schema: new LiveTable<{ id: string }, Foo>(this, 'schema', Foo),
            //
            images: new LiveTable<ImageT, ImageL>(this, 'images', ImageL),
            folders: new LiveTable<FolderT, FolderL>(this, 'folders', FolderL),
            //
            msgs: new LiveTable<{ id: string }, Foo>(this, 'msgs', Foo),
            scopes: new LiveTable<{ id: string }, Foo>(this, 'scopes', Foo),
            actions: new LiveTable<{ id: string }, Foo>(this, 'actions', Foo),
            status: new LiveTable<{ id: string }, Foo>(this, 'status', Foo),
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
