import * as path from '@tauri-apps/api/path'
import * as os from '@tauri-apps/api/os'
import { makeAutoObservable } from 'mobx'
import { Maybe } from '../core/ComfyUtils'
import { Workspace } from '../core/Workspace'
import { JsonFile } from './JsonFile'

export type UserConfigJSON = {
    version: 1
    theme?: 'dark' | 'light'
    recentProjects?: string[]
}

export class CushyStudio {
    constructor() {
        makeAutoObservable(this)
    }

    fetchBasicEnvInfos: Promise<void> = Promise.all([
        //
        os.platform(),
    ]).then(([os]) => {
        this.os = os
    })

    os: Maybe<os.Platform> = null

    /** currently opened workspace */
    workspace: Maybe<Workspace> = null

    openWorkspace = async (folderPath: string): Promise<Workspace> => {
        this.workspace = await Workspace.OPEN(this, folderPath)
        await this.fetchBasicEnvInfos
        const prevRecentProjects: string[] = this.userConfig.value.recentProjects ?? []

        let nextRecentProjects: string[] = [folderPath, ...prevRecentProjects.filter((p) => p !== folderPath)]
        if (nextRecentProjects.length > 10) nextRecentProjects = nextRecentProjects.slice(0, 10)

        this.userConfig.update({ recentProjects: nextRecentProjects })
        return this.workspace
    }

    closeWorkspace = async (): Promise<void> => {
        this.workspace = null
    }

    userConfig = new JsonFile<UserConfigJSON>({
        name: 'cushy-studio.json',
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
