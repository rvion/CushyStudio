import type { Maybe, Tagged } from 'src/utils/types'
import type { LiveInstance } from '../db/LiveInstance'
import type { FolderL, FolderUID } from './Folder'
import type { PromptID, PromptL } from './Prompt'

import { existsSync } from 'fs'
import { ComfyImageInfo } from '../types/ComfyWsApi'
import { AbsolutePath } from '../utils/fs/BrandedPaths'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { LiveRef } from '../db/LiveRef'

export type ImageID = Tagged<string, 'ImageUID'>
export interface ImageT {
    id: ImageID

    promptID: PromptID

    imageInfos: ComfyImageInfo
    // filename: string // 'ComfyUI_00017_.png'
    // subfolder: string // ''
    // type: string // 'temp'

    //
    // comfyRelativePath?: string
    // comfyURL?: string
    //
    // localAbsolutePath?: string
    // localURL?: string
    //
    star?: number
    folder?: FolderUID
}

export interface ImageL extends LiveInstance<ImageT, ImageL> {}
export class ImageL {
    get test1() {
        return 'a123'
    }

    get comfyURL() {
        return this.st.getServerHostHTTP() + '/view?' + new URLSearchParams(this.data.imageInfos).toString()
        // return `file://${this.data.localAbsolutePath}}`
    }

    /** absolute path on the machine with vscode */
    get localAbsolutePath(): AbsolutePath {
        return asAbsolutePath(path.join(this.st.cacheFolderPath, 'outputs', this.data.imageInfos.filename))
    }

    onCreate = () => {
        this.downloadImageAndSaveToDisk()
    }

    private downloadImageAndSaveToDisk = async (): Promise<true> => {
        const absPath = this.localAbsolutePath
        const exists = existsSync(absPath)
        if (exists) return true
        // if (this.status !== ImageStatus.Known) throw new Error(`image status is ${this.status}`)
        const response = await fetch(this.comfyURL, {
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

        console.info('🖼️ image saved')
        // this.status = ImageStatus.Saved
        return true
    }

    prompt = new LiveRef<PromptL>(this, 'promptID', 'prompts')

    // turns this into some clean abstraction
    _resolve!: (value: this) => void
    _rejects!: (reason: any) => void
    finished: Promise<this> = new Promise((resolve, rejects) => {
        this._resolve = resolve
        this._rejects = rejects
    })

    onUpdate = (prev: Maybe<ImageT>, next: ImageT) => {
        console.log('🟢 ImageL.onUpdate', prev, next)
        // if (next.localAbsolutePath) return this._resolve(this)
    }

    test2 = () => 'b123'
    moveTo(folder: FolderL) {
        this.update({ folder: folder.id })
    }
}

enum ImageStatus {
    Known = 1,
    Downloading = 2,
    Saved = 3,
}
