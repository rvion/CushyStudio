import type { ComfyNodeID } from '../types/ComfyNodeID'
import type { PromptID } from '../types/ComfyWsApi'
import type { ImageInfos_ComfyGenerated } from './ImageInfos_ComfyGenerated'
import type { MediaImageL } from './MediaImage'

import { mkdirSync, writeFileSync } from 'fs'
import { imageMeta } from 'image-meta'
import { dirname } from 'pathe'

import { bang } from '../csuite/utils/bang'
import { hashArrayBuffer } from '../state/hashArrayBuffer'
import { extractExtensionFromContentType } from '../widgets/misc/extractExtensionFromContentType'
import { FPath } from './PathObj'

export type ImageCreationOpts = {
    promptID?: Maybe<PromptID>
    stepID?: Maybe<StepID>
    comfyUIInfos?: Maybe<ImageInfos_ComfyGenerated>
    promptNodeID?: Maybe<ComfyNodeID>
}

export const createMediaImage_fromFileObject = async (
    //
    file: File,
    subFolder?: string,
): Promise<MediaImageL> => {
    console.log(`[🌠] createMediaImage_fromFileObject`)
    const relPath = new FPath(`outputs/${subFolder ?? 'imported'}/${file.name}`)
    return createMediaImage_fromBlobObject(file, relPath)
}

export const createMediaImage_fromBlobObject = async (
    //
    blob: Blob,
    fpath: FPath,
    opts?: ImageCreationOpts,
): Promise<MediaImageL> => {
    console.log(`[🌠] createMediaImage_fromBlobObject`)
    fpath.ensureDir()
    const buff: Buffer = await blob.arrayBuffer().then((x) => Buffer.from(x))
    fpath.write(buff)
    return _createMediaImage_fromLocalyAvailableImage(fpath, buff, opts)
}

export const createMediaImage_fromBuffer = async (
    buffer: Buffer,
    fpath: FPath,
    opts?: ImageCreationOpts,
): Promise<MediaImageL> => {
    console.log(`[🌠] createMediaImage_fromBlobObject`)
    fpath.ensureDir()
    fpath.write(buffer)
    return _createMediaImage_fromLocalyAvailableImage(fpath, buffer, opts)
}

export const createMediaImage_fromDataURI = (
    //
    dataURI: string,
    subFolder?: string,
    opts?: ImageCreationOpts,
): MediaImageL => {
    mkdirSync(`outputs/${subFolder}/`, { recursive: true })
    // type: 'data:image/png;base64,' => 'png
    const contentType = bang(dataURI.split(';')[0]).split(':')[1]
    if (contentType == null) throw new Error(`❌ dataURI mediaType is null`)
    if (contentType.length === 0) throw new Error(`❌ dataURI mediaType is empty`)
    if (contentType === 'text/plain') throw new Error(`❌ dataURI mediaType is text/plain`)
    if (contentType === 'text/html') throw new Error(`❌ dataURI mediaType is text/html`)
    const ext = extractExtensionFromContentType(contentType)
    if (ext == null) throw new Error(`❌ impossible to extract extension from dataURI`)

    const payload = dataURI.split(',')[1]
    if (payload == null) throw new Error(`❌ dataURI base64 payload is null`)
    if (payload.length === 0) throw new Error(`❌ dataURI base64 payload is empty`)
    const buff = Buffer.from(payload, 'base64')

    // 🔴🔴🔴🔴🔴
    const hash = hashArrayBuffer(new Uint8Array(buff))
    // 🔴🔴🔴🔴🔴

    // const fName = nanoid() + ext
    const fName = hash + ext
    const fpath = new FPath(`outputs/${subFolder}/${fName}`)
    fpath.write(buff)
    return _createMediaImage_fromLocalyAvailableImage(fpath, buff, opts)
}

export const createMediaImage_fromPath = (
    //
    path: FPath,
    opts?: ImageCreationOpts,
): MediaImageL => {
    const buff = path.readAsBuffer()
    // const buff = readFileSync(relPath)
    return _createMediaImage_fromLocalyAvailableImage(path, buff, opts)
}

export const _createMediaImage_fromLocalyAvailableImage = (
    fpath: FPath,
    preBuff?: Buffer | ArrayBuffer,
    opts?: ImageCreationOpts,
): MediaImageL => {
    const st = cushy
    const buff: Buffer | ArrayBuffer = preBuff ?? fpath.readAsBuffer()
    const uint8arr = new Uint8Array(buff)
    const fileSize = uint8arr.byteLength
    // 🔴 meta shouldn't be computed there; probably very inneficient
    const meta = imageMeta(uint8arr)
    if (meta.width == null) throw new Error(`❌ size.width is null`)
    if (meta.height == null) throw new Error(`❌ size.height is null`)
    const hash = hashArrayBuffer(uint8arr)
    console.log(`[🏞️]`, { ...meta, hash })

    // const prevs = st.db.media_image.find({ path: relPath }, { limit: 1 })
    const prevs = st.db.media_image.select((q) => q.where('path', '=', fpath.relPath).limit(1))
    const prev = prevs[0]

    if (prev) {
        if (prev.data.hash === hash) {
            // 🔴 do we really want to do that ?
            console.log(`[🏞️] exact same imamge; updating promptID and stepID`)
            prev.update({
                promptID: opts?.promptID ?? prev.data.promptID,
                stepID: opts?.stepID ?? prev.data.stepID,
            })
            return prev
        }
        console.log(`[🏞️] updating existing image (${fpath})`)
        // toastInfo(`🏞️ updating existing imamge`)
        prev.update({
            orientation: meta.orientation,
            type: meta.type,
            fileSize: fileSize,
            width: meta.width,
            height: meta.height,
            hash,
            path: fpath.relPath,
            promptID: opts?.promptID ?? prev.data.promptID,
            stepID: opts?.stepID ?? prev.data.stepID,
        })
        return prev
    }

    console.log(`[🏞️] create new image`)
    return st.db.media_image.create({
        // base
        path: fpath.relPath,
        // computed
        fileSize: fileSize,
        hash,
        // from meta
        orientation: meta.orientation,
        type: meta.type,
        width: meta.width,
        height: meta.height,
        // origin stuff; from opts
        promptID: opts?.promptID,
        stepID: opts?.stepID,
        comfyUIInfos: opts?.comfyUIInfos,
        promptNodeID: opts?.promptNodeID,
    })
}
