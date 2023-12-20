import type { ComfyUploadImageResult } from 'src/types/ComfyWsApi'

import path from 'pathe'
import { readFileSync } from 'fs'
import { lookup } from 'mime-types'
import { asSTRING_orCrash } from 'src/utils/misc/bang'
import type { STATE } from './state'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { hashBlob } from './hashBlob'

export class Uploader {
    constructor(private st: STATE) {}

    /** upload an image present on disk to ComfyUI */
    upload_FileAtAbsolutePath = async (filePath: AbsolutePath): Promise<ComfyUploadImageResult> => {
        const mime = asSTRING_orCrash(lookup(filePath))
        const file = new Blob([readFileSync(filePath)], { type: mime })
        return await this.upload_Blob(file)
    }

    /** upload an image from dataURL */
    upload_dataURL = async (dataURL: string): Promise<ComfyUploadImageResult> => {
        const mime = dataURL.split(';')[0].split(':')[1]
        console.log('[⬆️] upload_dataURL', mime)
        const file = new Blob([Buffer.from(dataURL.split(',')[1], 'base64')], { type: mime })
        return await this.upload_Blob(file)
    }

    /** upload an image present on disk to ComfyUI */
    upload_NativeFile = async (file: File): Promise<ComfyUploadImageResult> => {
        const blob = new Blob([await file.arrayBuffer()], { type: file.type })
        return await this.upload_Blob(blob)
    }

    /** upload an image that can be downloaded form a given URL to ComfyUI */
    upload_ImageAtURL = async (url: string): Promise<ComfyUploadImageResult> => {
        const blob: Blob = await this.st.getUrlAsBlob(url)
        return this.upload_Blob(blob)
    }

    /** upload a deck asset to ComfyUI */
    upload_Asset = async (assetName: RelativePath): Promise<ComfyUploadImageResult> => {
        const absPath = asAbsolutePath(path.join(this.st.rootPath, assetName))
        return this.st.uploader.upload_FileAtAbsolutePath(absPath)
    }

    /** upload a blob */
    upload_Blob = async (blob: Blob): Promise<ComfyUploadImageResult> => {
        console.warn('[⬆️] upload_Blob')
        // 1. hash the image blob, and retrieve its stable name for quick lookup
        const hash = await hashBlob(blob)
        const uniqFileName = `${hash}.png` as Enum_LoadImage_image

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
}
