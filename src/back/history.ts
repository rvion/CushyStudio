import { makeAutoObservable } from 'mobx'
import { WorkspaceHistoryJSON, newWorkspaceHistory } from '../core/WorkspaceHistoryJSON'
import { MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import { AbsolutePath } from '../utils/fs/BrandedPaths'
import { asRelativePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'

export class WorkspaceHistory {
    data: WorkspaceHistoryJSON
    private path: AbsolutePath
    constructor(
        //
        public serverState: ServerState,
    ) {
        this.path = this.serverState.resolve(asRelativePath('.cushy/history.json'))
        const prev = this.serverState.readJSON(this.path, newWorkspaceHistory())
        this.data = prev
        makeAutoObservable(this)
    }

    tagFile = (file: AbsolutePath, tag: string) => {
        const prevMeta = (this.data.fileMetadata[file] = {})
        this.scheduleSave()
    }

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
