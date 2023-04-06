import type { Maybe } from '../core/ComfyUtils'
import type { AbsolutePath, RelativePath } from './pathUtils'
import type { FileActionResult } from './FileActionResult'
import type { ItemDataType } from 'rsuite/esm/@types/common'

import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { toast } from 'react-toastify'
import { makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

export type MenuFileEntry = ItemDataType<string | number> & { entry: fs.FileEntry }
/** filesystem abstraction
 *  - restrict operations to a local folder
 *  - extra type safety via branded types
 *  - handle path normalisation
 * */

export class RootFolder {
    files: MenuFileEntry[] = []

    sort = true
    createNode = (entry: fs.FileEntry): MenuFileEntry => {
        const hasChildren = entry.children != null
        return {
            label: entry.name,
            path: entry.path,
            entry: entry,
            value: entry.path,
            children: hasChildren ? ([] as MenuFileEntry[]) : undefined,
        }
    }

    getNodes = async (path: string): Promise<MenuFileEntry[]> => {
        const entries: fs.FileEntry[] = await fs.readDir(path, { recursive: false })
        const entriesFiltered = entries.filter((e) => {
            if (e.name?.startsWith('.')) return false
            if (e.name === 'cache') return false
            return true
        })
        const items = entriesFiltered.map(this.createNode)
        return this.sort // folders first
            ? items.sort((a, b) => (b.children ? 1 : 0) - (a.children ? 1 : 0))
            : items
    }

    fetchNodes = (activeNode: ItemDataType) => {
        return new Promise<MenuFileEntry[]>((resolve) => {
            setTimeout(() => {
                // console.log('🐙', { activeNode })
                // return resolve([])
                return resolve(this.getNodes(activeNode.entry.path))
            }, 500)
        })
    }

    constructor(public absPath: AbsolutePath) {
        makeAutoObservable(this, { files: observable.ref })
        void (async () => {
            const topLevelNodes = await this.getNodes(this.absPath)
            this.files = topLevelNodes
        })()
        // void this.loadFolder()
    }
    // loadFolder = async () => {
    //     const files: fs.FileEntry[] = await fs.readDir(this.absPath, { recursive: true })
    //     // this.files = files.map(this.mapFS)
    //     console.log({ files: this.files }, this.count)
    // }

    /** 📝 should be the SINGLE function able to save text files */
    readTextFile = async (relativePath: RelativePath): Promise<Maybe<string>> => {
        const absoluteFilePath = await path.join(this.absPath, relativePath)
        const exists = await fs.exists(absoluteFilePath)
        if (exists) return await fs.readTextFile(absoluteFilePath)
        return null
    }

    /** 📝 should be the SINGLE function able to save text files */
    writeTextFile = async (relativePath: RelativePath, contents: string): Promise<FileActionResult> => {
        // 1. resolve absolute path
        const absoluteFilePath = await path.join(this.absPath, relativePath)
        // 2. create folder if missing
        const folder = await path.dirname(absoluteFilePath)
        const folderExists = await fs.exists(folder)
        if (!folderExists) {
            await fs.createDir(folder, { recursive: true })
            // this.notify(`Created folder ${folder}`)
        }
        // 3. check previous file content
        const prevExists = await fs.exists(absoluteFilePath)
        const prev = prevExists ? await fs.readTextFile(absoluteFilePath) : null
        // 4. save if necessary
        if (prev != contents) {
            await fs.writeTextFile({ path: absoluteFilePath, contents })
            return prevExists ? 'updated' : 'created'
            // this.notify(`updated file ${relativePath}`)
        }
        return 'same'
    }

    /** 📝 should be the SINGLE function able to save binary files */
    writeBinaryFile = async (relativePath: RelativePath, contents: fs.BinaryFileContents) => {
        // 1. resolve absolute path
        const absoluteFilePath = await path.join(this.absPath, relativePath)
        // console.log('>>> 🔴y', absoluteFilePath)
        // 2. create folder if missing
        const folder = await path.dirname(absoluteFilePath)
        const folderExists = await fs.exists(folder)
        if (!folderExists) {
            await fs.createDir(folder, { recursive: true })
            // this.notify(`Created folder ${folder}`)
        }
        // 3. update file (NO check to see if previous file similar)
        await fs.writeBinaryFile({ path: absoluteFilePath, contents })
        // this.notify(`wrote file ${relativePath}`)
    }

    private notify = (msg: string) => {
        toast(msg, { type: 'info', position: 'bottom-right' })
    }
}
