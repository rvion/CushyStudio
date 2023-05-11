import { makeAutoObservable, toJS } from 'mobx'
import { CushyDBData, newWorkspaceHistory } from '../core/WorkspaceHistoryJSON'
import { MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import { FrontState } from './FrontState'
import { FolderUID, ImageInfos } from '../core/GeneratedImageSummary'
import { bang } from '../utils/bang'
import { nanoid } from 'nanoid'

export class CushyDB {
    data: CushyDBData = newWorkspaceHistory()
    constructor(
        //
        public frontState: FrontState,
    ) {
        makeAutoObservable(this)
    }

    reset = () => {
        this.data = newWorkspaceHistory()
        this.frontState.sendMessageToExtension({ type: 'reset' })
    }

    createFolder = () => {
        const folderUID = nanoid()
        this.data.folders[folderUID] = {}
    }

    updateConfig = (values: Partial<CushyDBData>) => {
        Object.assign(this.data.config, values)
        this.scheduleSync()
    }

    moveFile = (ii: ImageInfos, folderUID: FolderUID) => {
        // 1. index folder in file
        const fileMeta = this.data.files[ii.uid]
        if (fileMeta == null) this.data.files[ii.uid] = {}
        this.data.files[ii.uid].folder = folderUID

        // 2. index file in folder
        const folderMeta = this.data.folders[folderUID]
        if (folderMeta == null) this.data.folders[folderUID] = {}
        if (this.data.folders[folderUID].imageUIDs == null) this.data.folders[folderUID].imageUIDs = []
        this.data.folders[folderUID].imageUIDs?.push(ii.uid)

        // 3. schedule sync
        this.scheduleSync()
    }

    // tagFile = (file: string, values: { [key: string]: any }) => {
    //     const prevMeta = this.data.fileMetadata[file]
    //     if (prevMeta) Object.assign(prevMeta, values)
    //     else this.data.fileMetadata[file] = values
    //     this.scheduleSync()
    // }

    recordEvent = (msg: MessageFromExtensionToWebview) => {
        console.log('🔴 recording', msg)
        this.data.msgs.push({ at: Date.now(), msg })
        this.scheduleSync()
    }

    private syncTimeout: NodeJS.Timeout | null = null
    private scheduleSync = () => {
        if (this.syncTimeout) return
        this.syncTimeout = setTimeout(() => {
            console.log(`💾 sync DB`)
            console.log(toJS(this.data))
            // this.syncTimeout = null
            // this.serverState.writeTextFile(this.path, JSON.stringify(this.data))
        }, 1000)
    }
}
