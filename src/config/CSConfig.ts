import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { makeAutoObservable } from 'mobx'

/** cushy studio main config file */
export type CSConfigJSON = {
    version: 1
    workspace: string
    comfyWSURL: string
    comfyHTTPURL: string
}

/** load / save global CushyStudio Config files */
export class CSConfig {
    constructor() {
        makeAutoObservable(this)
        void this.init()
    }
    /** true when config loaded */
    ready: boolean = false

    /** the current config  */
    config!: CSConfigJSON

    /** the current config file path  */
    configFilePath!: string

    /** the current config dir  */
    configDir!: string

    init = async (): Promise<CSConfigJSON> => {
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
        let config: CSConfigJSON
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
        await this.saveBackup()
        // write a config backup in your workspace

        return config
    }

    /** save config file on disk */
    save = async (): Promise<true> => {
        // 1. save primary
        console.log('[🛋] saving config to ', this.configFilePath)
        const configFileContent = JSON.stringify(this.config, null, 4)
        await fs.writeTextFile(this.configFilePath, configFileContent)

        await this.saveBackup()
        return true
    }

    saveBackup = async () => {
        const backupConfigFilePath = this.config.workspace + path.sep + 'CushyStudio.backup.json'
        console.log('[🛋] saving config backup to ', backupConfigFilePath)
        await fs.writeTextFile(backupConfigFilePath, JSON.stringify(this.config, null, 4))
        return true
    }

    /** update config then save it */
    updateConfig = async (configChanges: Partial<CSConfigJSON>): Promise<true> => {
        if (!this.ready) throw new Error('❌ config not ready')
        Object.assign(this.config, configChanges)
        return await this.save()
    }

    mkDefaultConfig = async () => {
        const userFolder = await path.homeDir()
        const defaultWorkspace = await path.join(userFolder, 'CushyStudio')
        const config: CSConfigJSON = {
            version: 1,
            workspace: defaultWorkspace,
            comfyWSURL: 'ws://127.0.0.1:8188/ws',
            comfyHTTPURL: 'http://127.0.0.1:8188',
        }
        return config
    }
}
