import type { CSConfig } from './CSConfig'

import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { makeAutoObservable } from 'mobx'

/** load / save global CushyStudio Config files */
export class CSConfigManager {
    constructor() {
        makeAutoObservable(this)
        void this.init()
    }
    /** true when config loaded */
    ready: boolean = false

    /** the current config  */
    config!: CSConfig

    /** the current config file path  */
    configFilePath!: string

    /** the current config dir  */
    configDir!: string

    init = async (): Promise<CSConfig> => {
        // 1. ensure config folder exists
        const configDir = await path.appConfigDir()
        this.configDir = configDir
        const configDireExists = await fs.exists(configDir)
        if (!configDireExists) {
            console.log('[🛋] config folder not found, creating config folder ', configDir)
            await fs.createDir(configDir, { recursive: true })
        }

        // 2. ensure config exists
        const configFilePath = await path.join(configDir, 'cushy-studio.json')
        this.configFilePath = configFilePath
        let config: CSConfig
        const configFileExists = await fs.exists(configFilePath)
        if (!configFileExists) {
            console.log('[🛋] config not found, creating default config at ', configFilePath)
            config = await this.mkDefaultConfig()
            await fs.writeTextFile(configFilePath, JSON.stringify(config, null, 4))
        } else {
            console.log('[🛋] config found at ', configFilePath)
            const configStr = await fs.readTextFile(configFilePath)
            config = JSON.parse(configStr)
        }
        // 3. report as ready
        this.ready = true
        this.config = config
        return config
    }

    updateConfig = async (configChanges: Partial<CSConfig>): Promise<true> => {
        if (!this.ready) throw new Error('❌ config not ready')
        Object.assign(this.config, configChanges)
        const configFileContent = JSON.stringify({ ...this.config, ...configChanges }, null, 4)
        await fs.writeTextFile(this.configFilePath, configFileContent)
        return true
    }
    // set workspace(newWorkspace: string) {
    // get workspace(){
    //     return this.workspace
    // }

    mkDefaultConfig = async () => {
        const userFolder = await path.homeDir()
        const defaultWorkspace = await path.join(userFolder, 'CushyStudio')
        const config: CSConfig = {
            version: 1,
            workspace: defaultWorkspace,
            comfyWSURL: 'ws://localhost:8188',
            comfyHTTPURL: 'http://localhost:8188',
        }
        return config
    }
}
