// import * as path from '@tauri-apps/api/path'
// import { makeAutoObservable } from 'mobx'
// import { Workspace } from '../core/Workspace'
// import { logger } from '../logger/Logger'
// import { bang } from '../utils/bang'
// import { RelativePath } from '../fs/pathUtils'
// import { readableStringify } from '../utils/stringifyReadable'
// import { RootFolder } from '../fs/RootFolder'

// export type PersistedJSONInfo<T> = {
//     /** human readable title */
//     title: string

//     relativePath: RelativePath

//     /** lazy but synchronous initialization function for default value */
//     init: () => T

//     /** prettier will indent json up to this level of nesting */
//     maxLevel?: number

//     /** callback called when file API is ready to be used */
//     onReady?: (data: T) => void
// }

// export class JsonFile<T extends object> {
//     private ready_yes!: (v: boolean) => void
//     private ready_no!: (err: Error) => void
//     finished = new Promise<boolean>((yes, no) => {
//         this.ready_yes = yes
//         this.ready_no = no
//     })

//     constructor(
//         //
//         public rootFolder: RootFolder,
//         public conf: PersistedJSONInfo<T>,
//     ) {
//         makeAutoObservable(this)
//         void this.init()
//     }

//     private init = async (): Promise<T> => {
//         const conf: PersistedJSONInfo<T> = this.conf
//         const existingContent = await this.rootFolder.readTextFile(conf.relativePath)
//         // console.log('🚀 ~ file: JsonFile.ts:46 ~ JsonFile<T ~ init= ~ existingContent:', existingContent)
//         this._value = existingContent ? JSON.parse(existingContent) : conf.init()
//         // console.log('🚀 ~ file: JsonFile.ts:48 ~ JsonFile<T ~ init= ~ this._value:', this._value)
//         this.setReady()
//         await this.save()
//         return this._value
//     }

//     /** true when config loaded */
//     ready: boolean = false
//     setReady() {
//         this.ready = true
//         this.conf.onReady?.(this.value)
//         this.ready_yes(true)
//     }
//     private _folder!: string
//     get folder() { return bang(this._folder); } // prettier-ignore

//     private _value!: T
//     get value() { return bang(this._value); } // prettier-ignore

//     /** save the file */
//     save = async (): Promise<true> => {
//         const maxLevel = this.conf.maxLevel
//         const content =
//             maxLevel == null //
//                 ? JSON.stringify(this.value, null, 4)
//                 : readableStringify(this.value, maxLevel)
//         await this.rootFolder.writeTextFile(this.conf.relativePath, content)
//         return true
//     }

//     /** update config then save it */
//     update = async (configChanges: Partial<T>): Promise<true> => {
//         Object.assign(this.value, configChanges)
//         return await this.save()
//     }
// }
