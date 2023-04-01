import type { Maybe } from '../core/ComfyUtils'
import { AbsolutePath, asAbsolutePath, asRelativePath } from '../utils/pathUtils'

import * as dialog from '@tauri-apps/api/dialog'
import * as os from '@tauri-apps/api/os'
import * as path from '@tauri-apps/api/path'

import { makeAutoObservable } from 'mobx'
import { Workspace } from '../core/Workspace'
import { JsonFile } from './JsonFile'
import { RootFolder } from './RootFolder'

export type UserConfigJSON = {
    version: 1
    theme?: 'dark' | 'light'
    recentProjects?: AbsolutePath[]
    reOpenLastProject?: boolean
}

/** global Singleton state for the application */
export class CushyStudio {
    static CREATE = async () => {
        const currentOS: os.Platform = await os.platform()
        const configDir: AbsolutePath = asAbsolutePath(await path.appConfigDir())
        return new CushyStudio(
            //
            currentOS,
            configDir,
        )
    }

    rootFolder: RootFolder
    userConfig: JsonFile<UserConfigJSON>
    private constructor(
        /** sync cached value so we don't have to do RPC with rust to find out */
        public os: os.Platform,
        /** sync cached value so we don't have to do RPC with rust to find out */
        public configDir: AbsolutePath,
    ) {
        this.rootFolder = new RootFolder(this.configDir)
        this.userConfig = new JsonFile<UserConfigJSON>(this.rootFolder, {
            title: 'Global Config',
            relativePath: asRelativePath('cushy-studio.json'),
            init: (): UserConfigJSON => ({ version: 1, theme: 'dark', recentProjects: [] }),
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

        makeAutoObservable(this)
    }

    /** currently opened workspace */
    workspace: Maybe<Workspace> = null

    closeWorkspace = async (): Promise<void> => {
        // 🔴 TODO: ensure we properly close all necessary sockets, etc, etc.
        this.workspace = null
    }

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

    /** true when user config is ready */
    get ready(): boolean {
        return this.userConfig.ready
    }
}
