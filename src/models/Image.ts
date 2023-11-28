import type { LiveInstance } from '../db/LiveInstance'
import type { PromptID } from './Prompt'

import { basename, join } from 'pathe'
import { assets } from 'src/utils/assets/assets'
import { ComfyImageInfo, ComfyUploadImageResult } from '../types/ComfyWsApi'
import { AbsolutePath } from '../utils/fs/BrandedPaths'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { exhaust } from 'src/utils/misc/ComfyUtils'

export type ImageID = Branded<string, { ImageUID: true }>

// ---------------------------------------------------------------------------------------------------
// 2023-11-27: image model was a mess; at first, I though I could unify all image strings
// into a single type, but it turns out that it's not possible
// I thing having a discriminated union with the real source semantic is the best way to go
// this way, we can derive common fields from the infos payload

// prettier-ignore
type MediaInfos =
    | ImageInfos_ComfyGenerated
    | ImageInfos_Local
    | ImageInfos_Base64
    | VideoInfos_FFMPEG

type ImageInfos_ComfyGenerated = {
    type: 'image-generated-by-comfy'
    comfyHostHttpURL: string
    comfyImageInfo: ComfyImageInfo
    promptID?: Maybe<PromptID> /** prompt from which the image is generated from; */
    absPath?: string /** present if the file has been cached locally */
}
type ImageInfos_Local = {
    type: 'image-local'
    absPath: AbsolutePath
}
type ImageInfos_Base64 = {
    type: 'image-base64'
    base64Url: string
}
type VideoInfos_FFMPEG = {
    type: 'video-local-ffmpeg'
    absPath: AbsolutePath
}

// ---------------------------------------------------------------------------------------------------
export interface ImageT<T extends MediaInfos = MediaInfos> {
    /** image ID */
    id: ImageID

    /** image creation date */
    createdAt: number

    /** image update date */
    updatedAt: number

    /** the main field */
    infos?: T

    /** asset rating */
    star?: number

    /** asset width, in pixel */
    width?: number

    /** asset height, in pixel */
    height?: number
}

const getComfyURLFromImageInfos = (infos: ImageInfos_ComfyGenerated) => {
    return infos.comfyHostHttpURL + '/view?' + new URLSearchParams(infos.comfyImageInfo).toString()
}

export interface ImageL extends LiveInstance<ImageT, ImageL> {}
export class ImageL {
    // 🟢
    get filename() {
        const infos = this.data.infos
        if (infos == null) return 'null'
        if (infos.type === 'image-local') return basename(infos.absPath)
        if (infos.type === 'image-base64') return infos.base64Url
        if (infos.type === 'image-generated-by-comfy') return basename(infos.comfyImageInfo.filename)
        // if (infos.type === 'image-uploaded-to-comfy') return basename(infos.comfyUploadImageResult.name)
        if (infos.type === 'video-local-ffmpeg') return basename(infos.absPath)
        exhaust(infos)
        return 'unknown'
    }

    // 🟢
    /** ready to be used in image fields */
    get url() {
        const infos = this.data.infos
        if (infos == null) return `file://${assets.public_CushyLogo_png}`
        if (infos.type === 'image-local') return `file://${infos.absPath}`
        if (infos.type === 'image-base64') return infos.base64Url
        if (infos.type === 'video-local-ffmpeg') return `file://${infos.absPath}`
        if (infos.type === 'image-generated-by-comfy') {
            return infos.absPath //
                ? `file://${infos.absPath}`
                : getComfyURLFromImageInfos(infos)
        }
        exhaust(infos)
        return `file://${assets.public_CushyLogo_png}`
    }

    // 🟢
    /** absolute path on the machine running CushyStudio */
    get absPath(): Maybe<AbsolutePath> {
        const url = this.url
        if (url.startsWith('file://')) return asAbsolutePath(url.slice('file://'.length))
    }

    // 🟢
    onCreate = (): void => {
        this.downloadImageAndSaveToDisk()
    }

    get existsLocally(): boolean {
        return this.absPath != null
    }

    private downloadImageAndSaveToDisk = async (): Promise<true> => {
        const infos = this.data.infos
        if (infos?.type !== 'image-generated-by-comfy') return true
        if (infos.absPath != null) return true

        // error recovery => should never happend
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
        const outputRelPath = asRelativePath(join(infos.comfyImageInfo.subfolder, infos.comfyImageInfo.filename))
        const absPath = this.st.resolve(this.st.outputFolderPath, outputRelPath)
        this.st.writeBinaryFile(absPath, Buffer.from(binArr))
        this.update({
            infos: { ...infos, absPath: absPath },
            width: size?.width,
            height: size?.height,
        })
        console.info('🖼️ image saved')
        // this.status = ImageStatus.Saved
        this._resolve(this)
        return true
    }

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
