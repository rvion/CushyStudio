import type { STATE } from '../../state/state'

import { createMediaImage_fromPath } from '../../models/createMediaImage_fromWebFile'
import { FPath } from '../../models/PathObj'

export type FileDownloaded_IPCPayload = {
    originalFilename: string
    fileName: string
    absolutePath: string
    relativePath: string
}

// 🔶 type manually written by inspecting internal electron payload
export type SearchResult_IPCPayload = {
    requestId: number // 2
    matches: number // 76
    selectionArea: { x: number; y: number; width: number; height: number } //{ x: 619; y: 465; width: 37; height: 14 }
    activeMatchOrdinal: number // 1
    finalUpdate: boolean // true
}

export type Clipboard_ImagePayload = {
    format?: string // 'png' | 'webp' | 'raw' | 'jpeg'
    buffer: Buffer
}

export class ElectronUtils {
    constructor(public st: STATE) {
        const ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.removeAllListeners('execute')
        ipcRenderer.on('execute', async function (event, data) {
            const uid: number = data.uid
            const draftID: string = data.payload?.query?.draftID
            if (typeof draftID === 'number') {
                console.log(`[API] ❌ ERROR RETRIEVING `, event, data)
                ipcRenderer.send('executed', { uid, success: false, result: 698008 })
            } else {
                console.log(`[API] 🟢 must call draft(id=${draftID}) with payload:`, data.payload)
                const draft = cushy.db.draft.getOrThrow(draftID)
                draft.AWAKE()
                const step = draft.start({ httpPayload: data.payload })
                const res = await step.finished
                // 🔴 ugly API; will get refined later
                ipcRenderer.send('executed', {
                    uid,
                    success: true,
                    result: res,
                    imageURLs: step.generatedImages.map((img) => img.url),
                    imageDataURL: step.generatedImages.map((img) => img.getBase64Url()),
                    // result: 69.1337,
                })
            }
            // alert('execute') // this never gets called :(
        })

        ipcRenderer.removeAllListeners('filedownloaded')
        ipcRenderer.on('filedownloaded', (_ev, json: FileDownloaded_IPCPayload) => {
            createMediaImage_fromPath(new FPath(json.relativePath), {})
            // console.log(`[🧐] `, { json })
        })

        ipcRenderer.removeAllListeners('search-result')
        ipcRenderer.on('search-result', (_ev, json: SearchResult_IPCPayload) => {
            cushy.search.results = json
            // console.log(`[🔎] search-result =`, { json })
            // createMediaImage_fromPath(st, json.relativePath, {})
        })
    }

    toggleDevTools(): void {
        try {
            const prevPref = Boolean(this.st.configFile.value.preferDevToolsOpen)
            this.st.configFile.update({ preferDevToolsOpen: !prevPref })
            const ipcRenderer = window.require('electron').ipcRenderer
            ipcRenderer.send('toggle-devtools')
        } catch (error) {
            console.error('❌ failed to toggle DevTools', error)
        }
    }

    openDevTools = (updateConfig: boolean = false) => {
        try {
            this.st.configFile.update({ preferDevToolsOpen: true })
            const ipcRenderer = window.require('electron').ipcRenderer
            ipcRenderer.send('open-devtools')
        } catch (error) {
            console.error('❌ failed to open DevTools', error)
        }
    }

    closeDevTools = (updateConfig: boolean = false) => {
        try {
            this.st.configFile.update({ preferDevToolsOpen: false })
            const ipcRenderer = window.require('electron').ipcRenderer
            ipcRenderer.send('close-devtools')
        } catch (error) {
            console.error('❌ failed to close DevTools', error)
        }
    }

    copyImageToClipboard = (payload: Clipboard_ImagePayload) => {
        return new Promise((resolve, reject) => {
            const format = payload.format ?? 'png'
            const ipcRenderer = window.require('electron').ipcRenderer
            ipcRenderer.once('image-copied', (event, response) => {
                response.result === true ? resolve(response.data) : reject(response.data)
            })

            ipcRenderer.send('copy-image-to-clipboard', {
                format,
                buffer: payload.buffer,
            })
        })
    }
}
