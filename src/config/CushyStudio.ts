import * as path from '@tauri-apps/api/path'
import { makeAutoObservable } from 'mobx'
import { Maybe } from '../core/ComfyUtils'
import { Workspace } from '../core/Workspace'
import { PersistedJSON } from './PersistedJSON'

export type UserConfigJSON = {
    version: 1
    theme?: 'dark' | 'light'
    recentProjects?: string[]
}

export class CushyStudio {
    constructor() {
        makeAutoObservable(this)
    }

    /** currently opened workspace */
    workspace: Maybe<Workspace> = null

    openWorkspace = async (folderPath: string): Promise<Workspace> => {
        this.workspace = await Workspace.OPEN(folderPath)
        const prevRecentProjects: string[] = this.userConfig.value.recentProjects ?? []

        let nextRecentProjects: string[] = [folderPath, ...prevRecentProjects.filter((p) => p !== folderPath)]
        if (nextRecentProjects.length > 10) nextRecentProjects = nextRecentProjects.slice(0, 10)

        this.userConfig.assign({ recentProjects: nextRecentProjects })
        return this.workspace
    }

    closeWorkspace = async (): Promise<void> => {
        this.workspace = null
    }

    userConfig = new PersistedJSON<UserConfigJSON>({
        name: 'userConfig.json',
        init: (): UserConfigJSON => ({ version: 1, theme: 'dark', recentProjects: [] }),
        folder: path.appConfigDir(),
        onReady: (data) => {
            console.log('[CUSHY] user config loaded:', data)
            console.log('[CUSHY] recent projects:', data.recentProjects)
            if (data.recentProjects?.[0] === '/Users/loco/dev/CushyStudio/workspace') {
                console.log('[CUSHY] [DEV] opening last recent project:', data.recentProjects[0])
                this.openWorkspace(data.recentProjects[0])
            }
        },
    })

    /** true when user config is ready */
    get ready(): boolean {
        return this.userConfig.ready
    }
}
