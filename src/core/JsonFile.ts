import type { AbsolutePath } from 'src/utils/fs/BrandedPaths'

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { join } from 'path'

import { readableStringify } from '../utils/stringifyReadable'
import { bang } from '../utils/bang'

export type PersistedJSONInfo<T> = {
    folder: AbsolutePath
    maxLevel?: number
    name: string
    init: () => T
}

export class JsonFile<T extends object> {
    private ready_yes!: (v: boolean) => void
    private ready_no!: (err: Error) => void
    finished = new Promise<boolean>((yes, no) => {
        this.ready_yes = yes
        this.ready_no = no
    })

    constructor(private opts: PersistedJSONInfo<T>) {
        this.init(opts)
        makeAutoObservable(this)
    }

    private _folder!: string
    get folder() { return bang(this._folder); } // prettier-ignore

    private _path!: string
    get path() { return bang(this._path); } // prettier-ignore

    private _value!: T
    get value() { return bang(this._value); } // prettier-ignore

    /** save the file */
    save = (): true => {
        console.info(`[💾] CONFIGsaving [${this.opts.name}] to ${this._path}`)
        const maxLevel = this.opts.maxLevel
        const content =
            maxLevel == null //
                ? JSON.stringify(this.value, null, 4)
                : readableStringify(this.value, maxLevel)
        writeFileSync(this._path, content)
        return true
    }

    /** update config then save it */
    update = (configChanges: Partial<T>): true => {
        Object.assign(this.value, configChanges)
        return this.save()
    }

    init = (p: PersistedJSONInfo<T>): T => {
        // 1. ensure config folder exists
        this._folder = p.folder
        const folderExists = existsSync(this._folder)
        if (!folderExists) {
            console.info('[🛋]', `${p.name} creating missing folder [${this._folder}]`)
            mkdirSync(this._folder, { recursive: true })
        }

        // 2. ensure file exists
        this._path = join(this._folder, this.opts.name)
        const configFileExists = existsSync(this._path)
        if (!configFileExists) {
            console.info('[🛋]', `${p.name} not found, creating default`)
            this._value = p.init()
            this.save()
        } else {
            console.info('[🛋]', `${p.name} found at ${this._path}`)
            const configStr = readFileSync(this._path, 'utf-8')
            this._value = JSON.parse(configStr)
        }
        // 3. report as ready
        return this._value
    }
}
