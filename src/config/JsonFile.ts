import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { makeAutoObservable } from 'mobx'
import { logger } from '../logger/Logger'
import { bang } from '../utils/bang'
import { readableStringify } from '../utils/stringifyReadable'

export type PersistedJSONInfo<T> = {
    //
    folder: Promise<string>
    name: string
    init: () => T
    maxLevel?: number
    onReady?: (data: T) => void
}

export class JsonFile<T extends object> {
    private ready_yes!: (v: boolean) => void
    private ready_no!: (err: Error) => void
    finished = new Promise<boolean>((yes, no) => {
        this.ready_yes = yes
        this.ready_no = no
    })

    constructor(private opts: PersistedJSONInfo<T>) {
        makeAutoObservable(this)
        void this.init(opts)
    }

    /** true when config loaded */
    ready: boolean = false
    setReady() {
        this.ready = true
        this.opts.onReady?.(this.value)
        this.ready_yes(true)
    }
    private _folder!: string
    get folder() { return bang(this._folder); } // prettier-ignore

    private _path!: string
    get path() { return bang(this._path); } // prettier-ignore

    private _value!: T
    get value() { return bang(this._value); } // prettier-ignore

    /** save the file */
    save = async (): Promise<true> => {
        logger.info('🌠', `saving [${this.opts.name}] to ${this._path}`)
        const maxLevel = this.opts.maxLevel
        const content =
            maxLevel == null //
                ? JSON.stringify(this.value, null, 4)
                : readableStringify(this.value, maxLevel)
        await fs.writeTextFile(this._path, content)
        return true
    }

    /** update config then save it */
    update = async (configChanges: Partial<T>): Promise<true> => {
        Object.assign(this.value, configChanges)
        return await this.save()
    }

    init = async (p: PersistedJSONInfo<T>): Promise<T> => {
        // 1. ensure config folder exists
        this._folder = await p.folder
        const folderExists = await fs.exists(this._folder)
        if (!folderExists) {
            logger.info('🛋', `${p.name} creating missing folder [${this._folder}]`)
            await fs.createDir(this._folder, { recursive: true })
        }

        // 2. ensure file exists
        this._path = await path.join(this._folder, this.opts.name)
        const configFileExists = await fs.exists(this._path)
        if (!configFileExists) {
            logger.info('🛋', `${p.name} not found, creating default`)
            this._value = await p.init()
            this.setReady()
            await this.save()
        } else {
            logger.info('🛋', `${p.name} found at ${this._path}`)
            const configStr = await fs.readTextFile(this._path)
            this._value = JSON.parse(configStr)
            this.setReady()
        }
        // 3. report as ready
        // runInAction(() => {
        //     this.ready = true
        //     this._value = value
        // })
        // write a config backup in your workspace
        return this._value
    }
}
