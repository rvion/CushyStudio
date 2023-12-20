import type { STATE } from '../../state/state'
import { asAbsolutePath } from '../fs/pathUtils'

export class ElectronUtils {
    constructor(public st: STATE) {
        const ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.on(
            'filedownloaded',
            (
                _ev,
                json: {
                    originalFilename: string
                    fileName: string
                    absolutePath: string
                    relativePath: string
                },
            ) => {
                // console.log(`[👙] `, {ev, json})
                st.db.media_images.create({
                    infos: {
                        type: 'image-local',
                        absPath: asAbsolutePath(json.absolutePath),
                    },
                })
            },
        )
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
