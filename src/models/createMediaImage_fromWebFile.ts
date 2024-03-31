import type { ImageInfos_ComfyGenerated } from './ImageInfos_ComfyGenerated'
import type { STATE } from '../state/state'
import type { ComfyNodeID } from '../types/ComfyNodeID'
import type { PromptID } from '../types/ComfyWsApi'

import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { imageMeta } from 'image-meta'
import { dirname } from 'pathe'

import { MediaImageL } from './MediaImage'
import { hashArrayBuffer } from '../state/hashArrayBuffer'
import { bang } from '../utils/misc/bang'
import { extractExtensionFromContentType } from '../widgets/misc/extractExtensionFromContentType'

export type ImageCreationOpts = {
    promptID?: PromptID
    stepID?: StepID
    comfyUIInfos?: ImageInfos_ComfyGenerated
    promptNodeID?: ComfyNodeID
}

export const createMediaImage_fromFileObject = async (st: STATE, file: File, subFolder?: string): Promise<MediaImageL> => {
    console.log(`[🌠] createMediaImage_fromFileObject`)
    const relPath = `outputs/${subFolder ?? 'imported'}/${file.name}` as RelativePath
    return createMediaImage_fromBlobObject(st, file, relPath)
}

export const createMediaImage_fromBlobObject = async (
    //
    st: STATE,
    blob: Blob,
    relPath: string,
    opts?: ImageCreationOpts,
): Promise<MediaImageL> => {
    console.log(`[🌠] createMediaImage_fromBlobObject`)
    const dir = dirname(relPath)
    mkdirSync(dir, { recursive: true })
    const buff: Buffer = await blob.arrayBuffer().then((x) => Buffer.from(x))
    writeFileSync(relPath, buff)
    return _createMediaImage_fromLocalyAvailableImage(st, relPath, buff, opts)
}

export const createMediaImage_fromDataURI = (
    //
    st: STATE,
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
    const relPath = `outputs/${subFolder}/${fName}` as RelativePath
    writeFileSync(relPath, buff)
    return _createMediaImage_fromLocalyAvailableImage(st, relPath, buff, opts)
}

export const createMediaImage_fromPath = (
    //
    st: STATE,
    relPath: string,
    opts?: ImageCreationOpts,
): MediaImageL => {
    const buff = readFileSync(relPath)
    return _createMediaImage_fromLocalyAvailableImage(st, relPath, buff, opts)
}

export const _createMediaImage_fromLocalyAvailableImage = (
    st: STATE,
    relPath: string,
    preBuff?: Buffer | ArrayBuffer,
    opts?: ImageCreationOpts,
): MediaImageL => {
    const buff: Buffer | ArrayBuffer = preBuff ?? readFileSync(relPath)
    const uint8arr = new Uint8Array(buff)
    const fileSize = uint8arr.byteLength
    // 🔴 meta shouldn't be computed there; probably very inneficient
    const meta = imageMeta(uint8arr)
    if (meta.width == null) throw new Error(`❌ size.width is null`)
    if (meta.height == null) throw new Error(`❌ size.height is null`)
    const hash = hashArrayBuffer(uint8arr)
    console.log(`[🏞️]`, { ...meta, hash })

    // const prevs = st.db.media_image.find({ path: relPath }, { limit: 1 })
    const prevs = st.db.media_image.select((q) => q.where('path', '=', relPath).limit(1))
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
        console.log(`[🏞️] updating existing image (${relPath})`)
        // toastInfo(`🏞️ updating existing imamge`)
        prev.update({
            orientation: meta.orientation,
            type: meta.type,
            fileSize: fileSize,
            width: meta.width,
            height: meta.height,
            hash,
            path: relPath,
            promptID: opts?.promptID ?? prev.data.promptID,
            stepID: opts?.stepID ?? prev.data.stepID,
        })
        return prev
    }

    console.log(`[🏞️] create new image`)
    return st.db.media_image.create({
        // base
        path: relPath,
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
