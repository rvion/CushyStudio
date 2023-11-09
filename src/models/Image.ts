import type { LiveInstance } from '../db/LiveInstance'
import type { PromptID, PromptL } from './Prompt'

import { existsSync } from 'fs'
import { LiveRef } from '../db/LiveRef'
import { ComfyImageInfo } from '../types/ComfyWsApi'
import { AbsolutePath } from '../utils/fs/BrandedPaths'
import { asAbsolutePath } from '../utils/fs/pathUtils'

export type ImageID = Branded<string, { ImageUID: true }>

export interface ImageT {
    /** image ID */
    id: ImageID
    createdAt: number
    updatedAt: number
    /** prompt from which the image is generated from; null if the image is manually uploaded or created via a widget */
    promptID?: Maybe<PromptID>
    /** infos returned from ComfyUI; null if the image has another provenence */
    imageInfos?: ComfyImageInfo
    /** image ratings */
    star?: number
    /** where the file is either located locally / or aimed to be stored */
    localFilePath: AbsolutePath
    /** where the file exists locally */
    downloaded?: boolean
    /** defaults to image */
    type?: 'image' | 'video'
    width?: number
    height?: number
    // comfyRelativePath?: string
    // comfyURL?: string
    //
    // localAbsolutePath?: string
    // localURL?: string
}

export interface ImageL extends LiveInstance<ImageT, ImageL> {}
export class ImageL {
    get comfyUrl() {
        return this.st.getServerHostHTTP() + '/view?' + new URLSearchParams(this.data.imageInfos).toString()
    }

    get url() {
        if (this.data.downloaded) return `file://${this.localAbsolutePath}`
        if (this.data.imageInfos == null) return '❌'
        return this.comfyUrl
    }

    /** absolute path on the machine running CushyStudio */
    get localAbsolutePath(): AbsolutePath {
        // const fileName = this.data.imageInfos?.filename
        return this.data.localFilePath //
            ? this.data.localFilePath
            : asAbsolutePath('/ERROR.png')
        // : asAbsolutePath(join(this.st.cacheFolderPath, 'outputs', fileName ?? 'error'))
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

        let size: Maybe<{ width: number; height: number }>
        try {
            size = readPngSize(binArr)
            this.update
        } catch (error) {
            console.log(error)
        }
        // const binArr = new Uint16Array(numArr)

        this.st.writeBinaryFile(this.localAbsolutePath, Buffer.from(binArr))
        // const folder = join(absPath, '..')
        // mkdirSync(folder, { recursive: true })
        // writeFileSync(absPath, Buffer.from(binArr))
        this.update({
            downloaded: true,
            width: size?.width,
            height: size?.height,
        })
        console.info('🖼️ image saved')
        // this.status = ImageStatus.Saved
        this._resolve(this)
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
}

export function readPngSize(buffer: ArrayBuffer): { width: number; height: number } {
    const dataView = new DataView(buffer)

    // Check the PNG signature
    const hasSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
        (byte, index) => dataView.getUint8(index) === byte,
    )

    if (!hasSignature) {
        throw new Error('Not a PNG file.')
    }

    // The IHDR chunk is located at offset 8 (after the 8-byte signature)
    const length = dataView.getUint32(8) // Should be 13 for IHDR
    const type = dataView.getUint32(12) // Should be 'IHDR' (0x49484452)

    if (type === 0x49484452) {
        // 'IHDR' in hex
        // IHDR chunk found, read the width and height
        const width = dataView.getUint32(16) // Width: Offset 16 to 19
        const height = dataView.getUint32(20) // Height: Offset 20 to 23
        return { width, height }
    } else {
        throw new Error('IHDR chunk not found.')
    }
}
