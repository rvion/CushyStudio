import type { Maybe } from '../core/ComfyUtils'
import type { AbsolutePath, RelativePath } from '../utils/pathUtils'

import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { toast } from 'react-toastify'

/** filesystem abstraction
 *  - restrict operations to a local folder
 *  - extra type safety via branded types
 *  - handle path normalisation
 * */
export class RootFolder {
    constructor(public rootFolderPath: AbsolutePath) {}

    /** 📝 should be the SINGLE function able to save text files */
    readTextFile = async (relativePath: RelativePath): Promise<Maybe<string>> => {
        const absoluteFilePath = await path.join(this.rootFolderPath, relativePath)
        const exists = await fs.exists(absoluteFilePath)
        if (exists) return await fs.readTextFile(absoluteFilePath)
        return null
    }

    /** 📝 should be the SINGLE function able to save text files */
    writeTextFile = async (relativePath: RelativePath, contents: string): Promise<void> => {
        // 1. resolve absolute path
        const absoluteFilePath = await path.join(this.rootFolderPath, relativePath)
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
            this.notify(`updated file ${relativePath}`)
        }
    }

    /** 📝 should be the SINGLE function able to save binary files */
    writeBinaryFile = async (relativePath: RelativePath, contents: fs.BinaryFileContents) => {
        // 1. resolve absolute path
        const absoluteFilePath = await path.join(this.rootFolderPath, relativePath)
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
        this.notify(`wrote file ${relativePath}`)
    }

    private notify = (msg: string) => {
        toast(msg, { type: 'info', position: 'bottom-right' })
    }
}
