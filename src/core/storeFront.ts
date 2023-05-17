import * as Y from 'yjs'

import type { CushyDBData } from './WorkspaceHistoryJSON'
import syncedStore, { getYjsDoc } from '@syncedstore/core'
import { WebsocketProvider } from 'y-websocket'

export const doc = new Y.Doc({ autoLoad: true })
export const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', doc)
export const store = syncedStore<CushyDBData>(
    {
        config: {},
        files: {},
        folders: {},
        msgs: [],
    },
    doc,
)

export const disconnect = () => wsProvider.disconnect()
export const connect = () => wsProvider.connect()

wsProvider.on('status', (event: any) => {
    console.log(`🐙`, event.status) // logs "connected" or "disconnected"
})

wsProvider.on('sync', (event: any) => {
    console.log(`🐙`, event) // logs "connected" or "disconnected"
    const arr = doc.getArray('my-array')
    arr.insert(0, [{ type: 'a', foo: 'bar' }])
    console.log(`🔴🔴`, arr.toJSON())
})

/*

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const doc = new Y.Doc({ autoLoad: true })

const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', doc)

wsProvider.on('status', (event: any) => {
    console.log(`🐙`, event.status) // logs "connected" or "disconnected"
})

wsProvider.on('sync', (event: any) => {
    console.log(`🐙`, event) // logs "connected" or "disconnected"
    const arr = doc.getArray('my-array')
    arr.insert(0, [{ type: 'a', foo: 'bar' }])
    console.log(`🔴🔴`, arr.toJSON())
})

*/
