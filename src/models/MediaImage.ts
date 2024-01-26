import type { LiveInstance } from '../db/LiveInstance'

import { readFileSync } from 'fs'
import { imageMeta, ImageMeta } from 'image-meta'
import { basename, resolve } from 'pathe'
import { LiveRefOpt } from 'src/db/LiveRefOpt'
import { MediaImageT } from 'src/db/TYPES.gen'
import { SafetyResult } from 'src/safety/Safety'
import { hashArrayBuffer } from 'src/state/hashBlob'
import { ComfyNodeMetadata } from 'src/types/ComfyNodeID'
import { ComfyNodeJSON } from 'src/types/ComfyPrompt'
import { ManualPromise } from 'src/utils/misc/ManualPromise'
import { toastError } from 'src/utils/misc/toasts'
import { ComfyImageInfo } from '../types/ComfyWsApi'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { ComfyPromptL } from './ComfyPrompt'
import { ComfyWorkflowL } from './ComfyWorkflow'
import { CushyAppL } from './CushyApp'
import { CushyScriptL } from './CushyScriptL'
import { DraftL } from './Draft'
import { StepL } from './Step'
import { lookup } from 'mime-types'
import { asSTRING_orCrash } from 'src/utils/misc/bang'
import { getCurrentRun_IMPL } from './_ctx2'

export type ImageInfos_ComfyGenerated = {
    comfyHostHttpURL: string
    comfyImageInfo: ComfyImageInfo
}

export const getComfyURLFromImageInfos = (infos: ImageInfos_ComfyGenerated) => {
    return infos.comfyHostHttpURL + '/view?' + new URLSearchParams(infos.comfyImageInfo).toString()
}

export const checkIfComfyImageExists = async (
    comfyHostHttpURL: string,
    imageInfo: { type: `input` | `ouput`; subfolder: string; filename: string },
) => {
    try {
        const url = getComfyURLFromImageInfos({ comfyHostHttpURL, comfyImageInfo: imageInfo })
        console.log(`checkIfComfyImageExists`, { url })
        const result = await fetch(url, { method: `HEAD` })
        console.log(`checkIfComfyImageExists result`, { url, result })
        return result.ok
    } catch {
        return false
    }
}

export interface MediaImageL extends LiveInstance<MediaImageT, MediaImageL> {}
export class MediaImageL {
    /** return the image filename */
    get filename() {
        return basename(this.data.path)
        // const infos = this.data.comfyUIInfos
        // if (infos == null) return 'null'
        // if (infos.type === 'image-local') return basename(infos.absPath)
        // if (infos.type === 'image-base64') return this.id
        // if (infos.type === 'image-generated-by-comfy') return basename(infos.comfyImageInfo.filename)
        // // if (infos.type === 'image-uploaded-to-comfy') return basename(infos.comfyUploadImageResult.name)
        // // if (infos.type === 'video-local-ffmpeg') return basename(infos.absPath)
        // exhaust(infos)
        // return 'unknown'
    }

    get step(): Maybe<StepL> { return this.prompt?.step } // prettier-ignore
    get draft(): Maybe<DraftL> { return this.step?.draft } // prettier-ignore
    get app(): Maybe<CushyAppL> {return this.draft?.app} // prettier-ignore
    get script(): Maybe<CushyScriptL> {return this.app?.script } // prettier-ignore

    useAsDraftIllustration = (draft_?: DraftL) => {
        const draft = draft_ ?? this.draft
        if (draft == null) return toastError(`no related draft found`)
        draft.update({ illustration: this.url })
    }

    get relPath() {
        return asRelativePath(this.data.path)
    }

    get baseName() {
        return basename(this.data.path)
    }

    get baseNameWithoutExtension() {
        const fname = this.baseName
        return fname.slice(0, fname.lastIndexOf('.'))
    }

    /** return file extension including dot */
    get extension() {
        const fname = this.baseName
        return fname.slice(((fname.lastIndexOf('.') - 1) >>> 0) + 1)
    }

    /** get the expected enum name */
    get enumName(): Enum_LoadImage_image {
        // return `${this.baseNameWithoutExtension}-${this.data.hash}${this.extension}`
        return `${this.data.hash}${this.extension}` as Enum_LoadImage_image
    }

    uploadAndReturnEnumName = async (): Promise<Enum_LoadImage_image> => {
        const finalName = await this.st.uploader.upload_Image(this, { type: 'input', override: true })
        return finalName
    }

    loadInWorkflow = async (workflow_?: ComfyWorkflowL): Promise<LoadImage> => {
        const workflow = workflow_ ?? getCurrentRun_IMPL().workflow
        const enumName = await this.uploadAndReturnEnumName()
        const img = workflow.builder.LoadImage({ image: enumName })
        return img
    }

    loadInWorkflowAsMask = async (
        //
        channel: Enum_LoadImageMask_channel,
        workflow_?: ComfyWorkflowL,
    ): Promise<LoadImageMask> => {
        const workflow = workflow_ ?? getCurrentRun_IMPL().workflow
        const enumName = await this.uploadAndReturnEnumName()
        const mask: LoadImageMask = workflow.builder.LoadImageMask({ image: enumName, channel })
        return mask
    }

    /**
     * live reference to the prompt this image comes from
     * null if the image is not generated by comfy
     * @since v.2384
     */
    promptRef = new LiveRefOpt<this, ComfyPromptL>(this, 'promptID', () => this.db.comfy_prompts)

    /**
     * return the Comfy prompt instance from which this image was generated
     * null if the image is not generated by comfy
     * @since v.2384
     */
    get prompt(): Maybe<ComfyPromptL> {
        return this.promptRef.item
    }

    /**
     * return the workflow from which this image was generated
     * @since v.2384
     */
    get graph(): ComfyWorkflowL | undefined {
        return this.prompt?.graph
    }

    /** return the json of the ComfyNode that led to this image */
    get ComfyNode(): Maybe<ComfyNodeJSON> {
        const nodeID = this.data.promptNodeID
        if (nodeID == null) return null
        return this.graph?.data.comfyPromptJSON[nodeID]
    }

    get asHTMLImageElement(): HTMLImageElement {
        const img: HTMLImageElement = new Image()
        img.src = this.url
        return img
    }

    get width(): number {
        return this.data.width
    }

    get height(): number {
        return this.data.height
    }

    openInImageEditor = (): void => {
        this.st.layout.FOCUS_OR_CREATE('Paint', { imgID: this.id })
    }

    openInCanvasEditor = (): void => {
        this.st.layout.FOCUS_OR_CREATE('Canvas', { imgID: this.id })
    }

    /**
     * return the metadata of the ComfyNode that led to this image
     * null if not generated by comfy throu a CushyStudio prompt
     * null if no metadata associated in the node in CushyStudio
     */
    get ComfyNodeMetadta(): Maybe<ComfyNodeMetadata> {
        const nodeID = this.data.promptNodeID
        if (nodeID == null) return null
        return this.graph?.data.metadata[nodeID]
    }

    /**
     * return the base64 url for this file, regardless of it's exact representation
     * includes the prefix `data:image/<type>;base64,`
     */
    getBase64Url(): string {
        const imgType = this.data.type ?? 'png'
        return `data:image/${imgType};base64,${this.getBase64Payload()}`
    }

    /**
     * return the base64 url for this file, regardless of it's exact representation
     * does not includes the prefix `data:image/png;base64,`
     */
    getBase64Payload(): string {
        const bin = this.getArrayBuffer()
        return bin.toString('base64')
    }

    /** return the ArrayBuffer for this file, regardless it's exact representation  */
    getArrayBuffer(): Buffer {
        const bin = readFileSync(this.data.path)
        return bin
    }

    /** return as web `Blob` */
    getAsBlob(): Blob {
        const filePath = this.data.path
        const mime = asSTRING_orCrash(lookup(filePath))
        const blob = new Blob([readFileSync(filePath)], { type: mime })
        return blob
    }

    /** return as web `File` */
    getAsFile(): File {
        const filePath = this.data.path
        const mime = asSTRING_orCrash(lookup(filePath))
        const file = new File([readFileSync(filePath)], basename(filePath), { type: mime })
        return file
    }

    /** ready to be used in image fields */
    get url(): string {
        return `file://${this.absPath}`
    }

    /** absolute path on the machine running CushyStudio */
    get absPath(): AbsolutePath {
        const path = this.data.path
        if (path.startsWith('outputs/')) return this.st.resolveFromRoot(asRelativePath(path))
        return asAbsolutePath(resolve(this.st.rootPath, path))
    }

    get isSafe(): ManualPromise<SafetyResult> {
        return this.st.safetyChecker.isSafe(this.url)
    }

    get existsLocally(): boolean {
        return this.absPath != null
    }

    // turns this into some clean abstraction
    // _resolve!: (value: this) => void
    // _rejects!: (reason: any) => void
    // finished: Promise<this> = new Promise((resolve, rejects) => {
    //     this._resolve = resolve
    //     this._rejects = rejects
    // })
}

// ⏸️ getSize = async (): Promise<ImageMeta> => {
// ⏸️     if (this.data.width && this.data.height)
// ⏸️         return {
// ⏸️             width: this.data.width,
// ⏸️             height: this.data.height,
// ⏸️         }
// ⏸️     return this.updateImageMeta()
// ⏸️ }

// ⏸️ private updateImageMeta = async (buffer?: ArrayBuffer): Promise<ImageMeta> => {
// ⏸️     const buff = buffer ?? (await this.getArrayBuffer())
// ⏸️     const uint8arr = new Uint8Array(buff)
// ⏸️     const size = imageMeta(uint8arr)
// ⏸️     const hash = hashArrayBuffer(uint8arr)
// ⏸️     console.log(`[🏞️]`, { size, hash })
// ⏸️     this.update({
// ⏸️         width: size?.width,
// ⏸️         height: size?.height,
// ⏸️         fileSize: uint8arr.byteLength,
// ⏸️         hash: hash,
// ⏸️     })
// ⏸️     return size
// ⏸️ }
