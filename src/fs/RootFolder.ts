import * as vscode from 'vscode'
import type { Maybe } from '../utils/ComfyUtils'
import type { AbsolutePath, RelativePath } from './pathUtils'
import type { FileActionResult } from './FileActionResult'
import type { ItemDataType } from 'rsuite/esm/@types/common'

import * as fs from 'fs'
import * as path from 'path'
// import { toast } from 'react-toastify'
import { makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

// export type MenuFileEntry = ItemDataType<string | number> & { entry: fs.FileEntry }
/** filesystem abstraction
 *  - restrict operations to a local folder
 *  - extra type safety via branded types
 *  - handle path normalisation
 * */

export class RootFolder {
    // files: MenuFileEntry[] = []

    // sort = true
    // createNode = (entry: fs.FileEntry): MenuFileEntry => {
    //     const hasChildren = entry.children != null
    //     return {
    //         label: entry.name,
    //         path: entry.path,
    //         entry: entry,
    //         value: entry.path,
    //         children: hasChildren ? ([] as MenuFileEntry[]) : undefined,
    //     }
    // }

    // getNodes = async (path: string): Promise<MenuFileEntry[]> => {
    //     const entries: fs.FileEntry[] = await fs.readDir(path, { recursive: false })
    //     const entriesFiltered = entries.filter((e) => {
    //         if (e.name?.startsWith('.')) return false
    //         if (e.name === 'cache') return false
    //         return true
    //     })
    //     const items = entriesFiltered.map(this.createNode)
    //     return this.sort // folders first
    //         ? items.sort((a, b) => (b.children ? 1 : 0) - (a.children ? 1 : 0))
    //         : items
    // }

    // fetchNodes = (activeNode: ItemDataType) => {
    //     return new Promise<MenuFileEntry[]>((resolve) => {
    //         setTimeout(() => {
    //             // console.log('🐙', { activeNode })
    //             // return resolve([])
    //             return resolve(this.getNodes(activeNode.entry.path))
    //         }, 500)
    //     })
    // }

    constructor(public absPath: AbsolutePath) {
        makeAutoObservable(this)
        // void (async () => {
        //     // const topLevelNodes = await this.getNodes(this.absPath)
        //     // this.files = topLevelNodes
        // })()
        // void this.loadFolder()
    }
    // loadFolder = async () => {
    //     const files: fs.FileEntry[] = await fs.readDir(this.absPath, { recursive: true })
    //     // this.files = files.map(this.mapFS)
    //     console.log({ files: this.files }, this.count)
    // }

    /** 📝 should be the SINGLE function able to save text files */
    readTextFile = async (relativePath: RelativePath): Promise<Maybe<string>> => {
        const absoluteFilePath = path.join(this.absPath, relativePath)
        const exists = fs.existsSync(absoluteFilePath)
        if (exists) return fs.readFileSync(absoluteFilePath, 'utf-8')
        return null
    }

    /** 📝 should be the SINGLE function able to save text files */
    writeTextFile = async (relativePath: RelativePath, contents: string): Promise<FileActionResult> => {
        // 1. resolve absolute path
        const absoluteFilePath = await path.join(this.absPath, relativePath)
        // 2. create folder if missing
        const folder = path.dirname(absoluteFilePath)
        const folderExists = fs.existsSync(folder)
        if (!folderExists) {
            fs.mkdirSync(folder, { recursive: true })
            // this.notify(`Created folder ${folder}`)
        }
        // 3. check previous file content
        const prevExists = fs.existsSync(absoluteFilePath)
        const prev = prevExists ? fs.readFileSync(absoluteFilePath, 'utf-8') : null
        // 4. save if necessary
        if (prev !== contents) {
            fs.writeFileSync(absoluteFilePath, contents, 'utf-8')
            return prevExists ? 'updated' : 'created'
            // this.notify(`updated file ${relativePath}`)
        }
        return 'same'
    }

    /** 📝 should be the SINGLE function able to save binary files */
    writeBinaryFile = async (relativePath: RelativePath, contents: ArrayBuffer) => {
        // 1. resolve absolute path
        const absoluteFilePath = path.join(this.absPath, relativePath)
        // console.log('>>> 🔴y', absoluteFilePath)
        // 2. create folder if missing
        const folder = path.dirname(absoluteFilePath)
        const folderExists = fs.existsSync(folder)
        if (!folderExists) {
            fs.mkdirSync(folder, { recursive: true })
            // this.notify(`Created folder ${folder}`)
        }
        // 3. update file (NO check to see if previous file similar)
        fs.writeFileSync(absoluteFilePath, contents as any)
        // this.notify(`wrote file ${relativePath}`)
    }

    // private notify = (msg: string) => {
    //     toast(msg, { type: 'info', position: 'bottom-right' })
    // }
}
