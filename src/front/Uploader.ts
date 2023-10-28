import type { ComfyUploadImageResult } from 'src/types/ComfyWsApi'
import type { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import type { CardPath } from 'src/library/CardPath'

import path from 'pathe'
import { readFileSync } from 'fs'
import { lookup } from 'mime-types'
import { asSTRING_orCrash } from 'src/utils/bang'
import { STATE } from './state'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'

export class Uploader {
    constructor(private st: STATE) {}

    /** upload an image present on disk to ComfyUI */
    uploadFromAbsolutePath = async (filePath: AbsolutePath): Promise<ComfyUploadImageResult> => {
        const mime = asSTRING_orCrash(lookup(filePath))
        const file = new Blob([readFileSync(filePath)], { type: mime })
        return await this.uploadUIntArrToComfy(file)
    }

    /** upload an image present on disk to ComfyUI */
    uploadNativeFile = async (file: File): Promise<ComfyUploadImageResult> => {
        const blob = new Blob([await file.arrayBuffer()], { type: file.type })
        return await this.uploadUIntArrToComfy(blob)
    }

    /** upload an image that can be downloaded form a given URL to ComfyUI */
    uploadFromURL = async (url: string): Promise<ComfyUploadImageResult> => {
        const blob: Blob = await this.st.getUrlAsBlob(url)
        return this.uploadUIntArrToComfy(blob)
    }

    /** upload a deck asset to ComfyUI */
    uploadFromAsset = async (assetName: CardPath): Promise<ComfyUploadImageResult> => {
        const absPath = asAbsolutePath(path.join(this.st.rootPath, assetName))
        return this.st.uploader.uploadFromAbsolutePath(absPath)
    }

    private uploadUIntArrToComfy = async (blob: Blob): Promise<ComfyUploadImageResult> => {
        // 1. hash the image blob, and retrieve its stable name for quick lookup
        const hash = await this.hashBlob(blob)
        const uniqFileName = `${hash}.png`

        // 2. if image already exists, return it
        if (this.st.schema.hasImage(uniqFileName)) {
            console.log(`[⬆️] image already exists on current ComfyUI instance`)
            return { name: uniqFileName, type: 'input', subfolder: '' }
        }

        // 3. upload
        const form = new FormData()
        form.set('image', blob, uniqFileName)
        const uploadURL = this.st.getServerHostHTTP() + '/upload/image'
        const resp = await fetch(uploadURL, { method: 'POST', body: form })
        const result: ComfyUploadImageResult = (await resp.json()) as any

        // 4. check upload is successfull
        console.log({ 'resp.data': result })
        if (result.name == null) throw new Error('upload failed')

        // 5. patch the local ComfyUI schema locally
        this.st.schema.unsafely_addImageInSchemaWithoutReloading(result.name)

        // 6. return the image
        return result
    }

    private hashBlob = async (blob: Blob): Promise<string> => {
        const buffer = await blob.arrayBuffer()
        const hash = await crypto.subtle.digest('SHA-256', buffer)
        const hashArray = Array.from(new Uint8Array(hash))
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
        return hashHex
    }
}
