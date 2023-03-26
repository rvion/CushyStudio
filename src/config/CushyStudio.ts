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

    openWorkspace = async (folder: string): Promise<Workspace> => {
        this.workspace = await Workspace.OPEN(folder)
        this.userConfig.updateConfig({ recentProjects: [folder] })
        return this.workspace
    }

    closeWorkspace = async (): Promise<void> => {
        this.workspace = null
    }

    userConfig = new PersistedJSON<UserConfigJSON>({
        name: 'userConfig.json',
        init: (): UserConfigJSON => ({ version: 1, theme: 'dark', recentProjects: [] }),
        folder: path.appConfigDir(),
    })

    /** true when user config is ready */
    get ready(): boolean {
        return this.userConfig.ready
    }
}
