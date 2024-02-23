import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import JSON5 from 'json5'
import { makeAutoObservable } from 'mobx'
import { basename, dirname, join } from 'pathe'

import { readableStringify } from '../utils/formatters/stringifyReadable'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { bang } from '../utils/misc/bang'

// import { ZodSchema } from 'zod'

export type PersistedJSONInfo<T extends object> = {
    path: AbsolutePath
    init: () => T
    maxLevel?: number
    // schema?: ZodSchema<T>
    /** practical way to attempt to fix the config file if it's invalid */
    fixup?: (self: JsonFile<T>) => void
}

export class JsonFile<T extends object> {
    private ready_yes!: (v: boolean) => void
    private ready_no!: (err: Error) => void
    finished = new Promise<boolean>((yes, no) => {
        this.ready_yes = yes
        this.ready_no = no
    })

    filePath: AbsolutePath
    fileName: string
    folderPath: AbsolutePath
    folderName: string
    constructor(private p: PersistedJSONInfo<T>) {
        this.filePath = p.path
        this.fileName = basename(p.path)
        this.folderPath = asAbsolutePath(dirname(p.path))
        this.folderName = basename(this.folderPath)
        this.init(p)
        makeAutoObservable(this)
        p.fixup?.(this)
    }

    set = <const X extends keyof T>(k: X, v: T[X]) => {
        this.value[k] = v
    }

    get = <const X extends keyof T>(k: X): T[X] => {
        return this.value[k]
    }

    erase = () => {
        console.info(`[💾] CONFIG erasing [${this.fileName}]`)
        rmSync(this._path)
        this.init(this.p)
    }

    get folder() { return bang(this.folderPath); } // prettier-ignore

    private _path!: string
    get path() { return bang(this._path); } // prettier-ignore

    private _value!: T
    get value() { return bang(this._value); } // prettier-ignore

    /** save the file */
    save = (): true => {
        console.info(`[💾] CONFIGsaving [${this.fileName}] to ${this._path}`)
        const maxLevel = this.p.maxLevel
        const content =
            maxLevel == null //
                ? JSON.stringify(this.value, null, 4)
                : readableStringify(this.value, maxLevel)
        // console.warn(`[👙] save to `, this._path, content)
        writeFileSync(this._path, content)
        return true
    }

    /** update config then save it */
    update = (configChanges: Partial<T> | ((data: T) => void)): true => {
        if (typeof configChanges === 'function') {
            configChanges(this.value)
        } else {
            Object.assign(this.value, configChanges)
        }
        return this.save()
    }

    init = (p: PersistedJSONInfo<T>): T => {
        // 1. ensure config folder exists
        const folderExists = existsSync(this.folderPath)
        if (!folderExists) {
            console.info('[💾]', `${this.fileName} creating missing folder [${this.folderPath}]`)
            mkdirSync(this.folderPath, { recursive: true })
        }

        // 2. ensure file exists
        this._path = join(this.folderPath, this.fileName)
        const configFileExists = existsSync(this._path)
        if (!configFileExists) {
            console.info('[💾]', `${this.fileName} not found, creating default`)
            this._value = p.init()
            this.save()
        } else {
            // console.info('[💾]', `${this.fileName} found at ${this._path}`)
            const configStr = readFileSync(this._path, 'utf-8')
            this._value = JSON5.parse(configStr)
        }
        // 3. report as ready
        return this._value
    }
}
