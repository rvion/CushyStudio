import type { Maybe, Tagged } from 'src/utils/types'
import type { LiveInstance } from '../db/LiveInstance'
import type { FolderL, FolderID } from './Folder'
import type { PromptID, PromptL } from './Prompt'

import { existsSync } from 'fs'
import { ComfyImageInfo } from '../types/ComfyWsApi'
import { AbsolutePath } from '../utils/fs/BrandedPaths'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { LiveRef } from '../db/LiveRef'
import { join } from 'path'

export type ImageID = Tagged<string, 'ImageUID'>

export interface ImageT {
    /** image ID */
    id: ImageID
    /** prompt from which the image is generated from; null if the image is manually uploaded or created via a widget */
    promptID?: Maybe<PromptID>
    /** infos returned from ComfyUI; null if the image has another provenence */
    imageInfos?: ComfyImageInfo
    /** image ratings */
    star?: number
    /** Cushy image folder (drag and drop system) */
    folderID?: Maybe<FolderID>
    /** where the file is either located locally / or aimed to be stored */
    localFolderPath: AbsolutePath
    /** where the file exists locally */
    downloaded?: boolean

    // comfyRelativePath?: string
    // comfyURL?: string
    //
    // localAbsolutePath?: string
    // localURL?: string
}

export interface ImageL extends LiveInstance<ImageT, ImageL> {}
export class ImageL {
    get test1() {
        return 'a123'
    }

    get comfyUrl() {
        return this.st.getServerHostHTTP() + '/view?' + new URLSearchParams(this.data.imageInfos).toString()
    }

    get url() {
        if (this.data.downloaded) return `file://${this.localAbsolutePath}`
        if (this.data.imageInfos == null) return '❌'
        return this.comfyUrl
    }

    /** absolute path on the machine with vscode */
    get localAbsolutePath(): AbsolutePath {
        const fileName = this.data.imageInfos?.filename
        return this.data.localFolderPath && fileName //
            ? asAbsolutePath(join(`${this.data.localFolderPath}`, fileName))
            : asAbsolutePath(join(this.st.cacheFolderPath, 'outputs', fileName ?? 'error'))
    }

    onCreate = () => {
        if (this.data.downloaded) return
        this.downloadImageAndSaveToDisk()
    }

    private downloadImageAndSaveToDisk = async (): Promise<true> => {
        // error recovery => should never happend
        const absPath = this.localAbsolutePath
        const exists = existsSync(absPath)
        if (exists) {
            if (!this.data.downloaded) this.update({ downloaded: true })
            return true
        }

        const response = await fetch(this.url, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            // responseType: ResponseType.Binary,
        })
        const binArr = await response.arrayBuffer()
        // const binArr = new Uint16Array(numArr)

        this.st.writeBinaryFile(this.localAbsolutePath, Buffer.from(binArr))
        // const folder = join(absPath, '..')
        // mkdirSync(folder, { recursive: true })
        // writeFileSync(absPath, Buffer.from(binArr))
        this.update({ downloaded: true })
        console.info('🖼️ image saved')
        // this.status = ImageStatus.Saved
        return true
    }

    prompt = new LiveRef<this, PromptL>(this, 'promptID', 'prompts')

    // turns this into some clean abstraction
    _resolve!: (value: this) => void
    _rejects!: (reason: any) => void
    finished: Promise<this> = new Promise((resolve, rejects) => {
        this._resolve = resolve
        this._rejects = rejects
    })

    // onUpdate = (prev: Maybe<ImageT>, next: ImageT) => {
    //     console.log('🟢 ImageL.onUpdate', prev, next)
    //     // if (next.localAbsolutePath) return this._resolve(this)
    // }

    test2 = () => 'b123'
    moveTo(folder: FolderL) {
        this.update({ folderID: folder.id })
    }
}

enum ImageStatus {
    Known = 1,
    Downloading = 2,
    Saved = 3,
}
