import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'
import type { ComfyNodeMetadata } from '../types/ComfyNodeID'
import type { ComfyNodeJSON } from '../types/ComfyPrompt'
import type { ComfyPromptL } from './ComfyPrompt'
import type { ComfyWorkflowL } from './ComfyWorkflow'
import type { CushyAppL } from './CushyApp'
import type { CushyScriptL } from './CushyScript'
import type { DraftL } from './Draft'
import type { StepL } from './Step'
import type { MouseEvent } from 'react'

import { existsSync, mkdirSync, readFileSync, renameSync } from 'fs'
import { lookup } from 'mime-types'
import { runInAction } from 'mobx'
import { basename, resolve } from 'pathe'
import sharp from 'sharp'

import { hasMod } from '../app/shortcuts/META_NAME'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { SafetyResult } from '../safety/Safety'
import { createHTMLImage_fromURL } from '../state/createHTMLImage_fromURL'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { asSTRING_orCrash } from '../utils/misc/bang'
import { ManualPromise } from '../utils/misc/ManualPromise'
import { toastError, toastInfo } from '../utils/misc/toasts'
import { transparentImgURL } from '../widgets/galleries/transparentImg'
import { getCurrentRun_IMPL } from './getGlobalRuntimeCtx'

export interface MediaImageL extends LiveInstance<TABLES['media_image']> {}
export class MediaImageL {
    get imageID() {
        return this.id
    }

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

    /** flip image */
    // 👀 👉 https://github.com/lovell/sharp/issues/28#issuecomment-679193628
    // ⏸️ flip = async () => {
    // ⏸️     await sharp(this.absPath)
    // ⏸️         // .flip()
    // ⏸️         .toFile(this.absPath + '2')
    // ⏸️     renameSync(this.absPath + '2', this.absPath)
    // ⏸️ }

    /* XXX: This should only be a stop-gap for a custom solution that isn't hampered by the browser's security capabilities */
    /** Uses browser clipboard API to copy the image to clipboard, will only copy as a PNG and will not include metadata. */
    copyToClipboard = () => {
        createHTMLImage_fromURL(URL.createObjectURL(this.getAsBlob()))
            .then((img) => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')

                canvas.width = img.width
                canvas.height = img.height
                ctx?.drawImage(img, 0, 0)

                canvas.toBlob((blob) => {
                    if (blob == null) {
                        toastError(`Could not copy image to clipboard: ${blob}`)
                        return
                    }
                    navigator.clipboard
                        .write([
                            new ClipboardItem({
                                [blob.type]: blob,
                            }),
                        ])
                        .then(() => {
                            toastInfo('Image copied to clipboard!')
                        })
                        .catch((error) => {
                            toastError(`Could not copy image to clipboard: ${error}`)
                            console.error('Error copying image to clipboard:', error)
                        })
                })
            })
            .catch((error) => {
                toastError(`Could not copy image to clipboard: ${error}`)
                console.error('Error loading image:', error)
            })
    }

    copyToClipboardAsBase64 = () => {
        navigator.clipboard.writeText(this.getBase64Url()).then(() => {
            toastInfo('Image copied to clipboard!')
        })
    }

    useAsDraftIllustration = (draft_?: DraftL) => {
        const draft = draft_ ?? this.draft
        if (draft == null) return toastError(`no related draft found`)
        draft.update({ illustration: this.url })
    }

    get relPath() {
        return asRelativePath(this.data.path)
    }

    get relPathAsAbsPath(): string {
        return `/` + this.data.path
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

    onMouseEnter = (ev: MouseEvent): void => {
        cushy.hovered = this
    }
    onMouseLeave = (ev: MouseEvent): void => {
        if (cushy.hovered === this) cushy.hovered = null
    }
    onClick = (ev: MouseEvent): void => {
        if (hasMod(ev)) {
            ev.stopPropagation()
            ev.preventDefault()
            return void cushy.layout.FOCUS_OR_CREATE('Image', { imageID: this.id })
        }
        if (ev.shiftKey) {
            ev.stopPropagation()
            ev.preventDefault()
            return void cushy.layout.FOCUS_OR_CREATE('Canvas', { imgID: this.id })
        }
        if (ev.altKey) {
            ev.stopPropagation()
            ev.preventDefault()
            return void cushy.layout.FOCUS_OR_CREATE('Paint', { imgID: this.id })
        }

        return
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
    promptRef = new LiveRefOpt<this, ComfyPromptL>(this, 'promptID', 'comfy_prompt')

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

    asHTMLImageElement_wait = async (): Promise<HTMLImageElement> => {
        return createHTMLImage_fromURL(this.url)
    }

    get asHTMLImageElement_noWait(): HTMLImageElement {
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
     * add a tag to MediaImage.tags
     * internally stored as coma-separated string
     * */
    addTag = (...tags: string[]): this => {
        this.update({ tags: this.data.tags ? `${this.data.tags},${tags.join(',')}` : tags.join(',') })
        return this
    }

    /** remove image tag */
    removeTag = (...tagsToRemove: string[]): this => {
        if (this.data.tags == null) return this
        const tags = new Set(this.data.tags.split(','))
        for (const tag of tagsToRemove) tags.delete(tag)
        this.update({ tags: [...tags].join(',') })
        return this
    }

    /** get tags as string list (de-duplicated) */
    get tags(): string[] {
        if (this.data.tags == null) return []
        // temporary fix to deduplicate tags
        return [...new Set(this.data.tags.split(','))]
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
        const mime = asSTRING_orCrash(lookup(filePath), '❌ invalid mime type')
        const blob = new Blob([readFileSync(filePath)], { type: mime })
        return blob
    }

    /** return as web `File` */
    getAsFile(): File {
        const filePath = this.data.path
        const mime = asSTRING_orCrash(lookup(filePath), '❌ invalid mime type')
        const file = new File([readFileSync(filePath)], basename(filePath), { type: mime })
        return file
    }

    /** ready to be used in image fields */
    get url(): string {
        return `file://${this.absPath}?hash=${this.data.hash}`
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

    // THUMBNAIL ------------------------------------------------------------------------------------------

    /** allow to pick the best source to preserve CPU and MEMORY */
    urlForSize = (size: number): string => {
        // 32 x 32 mini-thumb
        const forceThumb = this.st.galleryConf.fields.onlyShowBlurryThumbnails.value
        if (forceThumb) return this.thumbhashURL
        if (size < 32) return this.thumbhashURL

        // 100 x 100 thumb
        if (size < 256) return this.thumbnailURL

        // full image
        return this.url
    }

    // THUMBNAIL ------------------------------------------------------------------------------------------
    _thumbnailReady: boolean = false
    get thumbnailURL() {
        // ⏸️ if (this._efficientlyCachedTumbnailBufferURL) return this._efficientlyCachedTumbnailBufferURL
        // no need to add hash suffix, cause path already uses hash
        if (this._thumbnailReady || existsSync(this._thumbnailAbsPath)) return `file://${this._thumbnailAbsPath}`
        this._mkThumbnail()
        return transparentImgURL
    }

    /** relative path to the thumbnail */
    get _thumbnailRelPath(): RelativePath {
        return `outputs/.thumbnails/${this.data.hash}.jpg` as RelativePath
    }

    /** absolute path to the thumbnail */
    get _thumbnailAbsPath(): AbsolutePath {
        // 2024-03-14 👉 not using join cause it's slow (trying to fix gallery perf problems)
        return `${this.st.rootPath}/${this._thumbnailRelPath}` as AbsolutePath
    }

    _mkThumbnail = async (): Promise<void> => {
        // console.log(`[🤠] creating thumbnail for`)
        // resize image to 100px
        const img = sharp(this.absPath).rotate().resize(100).jpeg({ mozjpeg: true })
        // then save file to disk for later use (when app restart, let's not re-compute the thumbnail)
        mkdirSync(resolve(this.st.rootPath, 'outputs/.thumbnails'), { recursive: true })
        await img.toFile(this._thumbnailRelPath)
        // then refresh the thumbnail
        this._thumbnailReady = true
    }

    // THUMBHASH ------------------------------------------------------------------------------------------
    // ❌ https://evanw.github.io/thumbhash/
    _mkThumbhash = async (): Promise</* { binary: Uint8Array; url: string } */ string> => {
        const image2 = await sharp(this.absPath).resize(32, 32, { fit: 'inside' }).webp({ quality: 1 }).toBuffer()
        const x = image2.toString('base64')
        // console.log(`[🤠] this.data.thumbnail 🟢 =`, x.length)
        return x
    }

    get thumbhashURL(): string {
        if (this.data.thumbnail && !this.data.thumbnail.startsWith('data:')) {
            // console.log(`[🤠] this.data.thumbnail 🔴 =`, this.data.thumbnail.length)
            return `data:image/webp;base64,${this.data.thumbnail}`
        }
        void this._mkThumbhash().then((url) => this.update({ thumbnail: url }))
        return ''
    }
}
