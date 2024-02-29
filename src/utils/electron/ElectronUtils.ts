import type { STATE } from '../../state/state'

import { createMediaImage_fromPath } from 'src/models/createMediaImage_fromWebFile'

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

export class ElectronUtils {
    constructor(public st: STATE) {
        const ipcRenderer = window.require('electron').ipcRenderer

        ipcRenderer.on('filedownloaded', (_ev, json: FileDownloaded_IPCPayload) => {
            createMediaImage_fromPath(st, json.relativePath, {})
            // console.log(`[👙] `, { json })
        })

        ipcRenderer.on('search-result', (_ev, json: SearchResult_IPCPayload) => {
            cushy.search.results = json
            // console.log(`[🔎] search-result =`, { json })
            // createMediaImage_fromPath(st, json.relativePath, {})
        })
    }

    toggleDevTools = () => {
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
}
