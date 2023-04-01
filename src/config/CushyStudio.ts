import type { Maybe } from '../core/ComfyUtils'
import { AbsolutePath, asAbsolutePath } from '../utils/pathUtils'
import * as dialog from '@tauri-apps/api/dialog'

import * as path from '@tauri-apps/api/path'
import * as os from '@tauri-apps/api/os'
import { makeAutoObservable } from 'mobx'
import { Workspace } from '../core/Workspace'
import { JsonFile } from './JsonFile'

export type UserConfigJSON = {
    version: 1
    theme?: 'dark' | 'light'
    recentProjects?: AbsolutePath[]
    reOpenLastProject?: boolean
}

export class CushyStudio {
    constructor() {
        makeAutoObservable(this)
    }

    /** sync cache to know current OS */
    os: Maybe<os.Platform> = null

    /** currently opened workspace */
    workspace: Maybe<Workspace> = null

    /** prompt user to open a workspace */
    openWorkspaceDialog = async () => {
        const workspaceFolder = await dialog.open({
            title: 'Open',
            directory: true,
            filters: [
                //
                { name: 'Civitai Project', extensions: ['cushy'] },
                { name: 'image', extensions: ['png'] },
            ],
        })
        if (typeof workspaceFolder !== 'string') {
            return console.log('❌ not a string:', workspaceFolder)
        }
        const absolutePath = asAbsolutePath(workspaceFolder)
        this.openWorkspace(absolutePath)
    }

    openWorkspace = async (absoluteFolderPath: AbsolutePath): Promise<Workspace> => {
        // 1. open the workspace
        this.workspace = await Workspace.OPEN(this, absoluteFolderPath)

        // 2. ensure basic infos are available 🔶 => move elsewhere
        await this.fetchBasicEnvInfos

        // 3. bump workspace to the top of the recent projects list
        const prevRecentProjects: AbsolutePath[] = this.userConfig.value.recentProjects ?? []
        let nextRecentProjects: AbsolutePath[] = [
            absoluteFolderPath,
            ...prevRecentProjects.filter((p) => p !== absoluteFolderPath),
        ]
        if (nextRecentProjects.length > 10) nextRecentProjects = nextRecentProjects.slice(0, 10)
        this.userConfig.update({ recentProjects: nextRecentProjects })

        // 4. return the workspace
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
            const lastProject = data.recentProjects?.[0]
            if (lastProject && this.userConfig.value.reOpenLastProject)
                // if (lastProject === '/Users/loco/dev/CushyStudio/src/examples') {
                // console.log('[CUSHY] [DEV] opening last recent project:', lastProject)
                this.openWorkspace(lastProject)
        },
    })

    /** true when user config is ready */
    get ready(): boolean {
        return this.userConfig.ready
    }

    /** TODO: add more stuff to cache at startup */
    fetchBasicEnvInfos: Promise<void> = Promise.all([
        //
        os.platform(),
    ]).then(([os]) => {
        this.os = os
    })
}
