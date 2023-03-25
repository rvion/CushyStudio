import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { makeAutoObservable, runInAction } from 'mobx'
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
        const workspace = new Workspace(folder)
        await workspace._schema.finished
        await workspace._config.finished
        this.workspace = workspace
        this.userConfig.updateConfig({ recentProjects: [folder] })
        return workspace
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
