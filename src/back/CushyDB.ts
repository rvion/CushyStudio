import { makeAutoObservable } from 'mobx'
import { CushyDBData, newWorkspaceHistory } from '../core/WorkspaceHistoryJSON'
import { MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import { AbsolutePath } from '../utils/fs/BrandedPaths'
import { asRelativePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'

export class CushyDB {
    data: CushyDBData
    private path: AbsolutePath
    constructor(
        //
        public serverState: ServerState,
    ) {
        this.path = this.serverState.resolve(serverState.rootPath, asRelativePath('.cushy/history.json'))
        const prev = this.serverState.readJSON(this.path, newWorkspaceHistory())
        this.data = prev
        makeAutoObservable(this)
    }

    reset = () => {
        this.data = newWorkspaceHistory()
        this.scheduleSave()
    }

    // updateConfig = (values: Partial<CushyDBData>) => {
    //     Object.assign(this.data.config, values)
    //     this.scheduleSave()
    // }

    // tagFile = (file: FileInf, values: { [key: string]: any }) => {
    //     const prevMeta = this.data.files[file]
    //     if (prevMeta) Object.assign(prevMeta, values)
    //     else this.data.fileMetadata[file] = values
    //     this.scheduleSave()
    // }

    recordEvent = (msg: MessageFromExtensionToWebview) => {
        console.log('🔴 recording', msg)
        this.data.msgs.push({ at: Date.now(), msg })
        this.scheduleSave()
    }

    private saveTimeout: NodeJS.Timeout | null = null
    private scheduleSave = () => {
        if (this.saveTimeout) return
        this.saveTimeout = setTimeout(() => {
            console.log(`💾 saving history`)
            this.saveTimeout = null
            this.serverState.writeTextFile(this.path, JSON.stringify(this.data))
        }, 1000)
    }
}
