import type { Runtime } from './Runtime'
import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import type { MediaImageL } from 'src/models/MediaImage'
import type { PromptID } from 'src/types/ComfyWsApi'

import { makeAutoObservable } from 'mobx'
import { hash } from 'ohash'

import {
    createMediaImage_fromBlobObject,
    createMediaImage_fromDataURI,
    createMediaImage_fromPath,
} from 'src/models/createMediaImage_fromWebFile'

/** namespace for all image-related utils */
export class RuntimeImages {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }

    // ----------------------------------------------------------------------------------------
    // simple to use functions
    loadAsImage = async (relPathOrDataURL: string, workflow?: ComfyWorkflowL): Promise<LoadImage> => {
        const img = this.createFromDataURLOrPath(relPathOrDataURL)
        return await img.loadInWorkflow(workflow)
    }

    loadAsMask = async (
        relPathOrDataURL: string,
        channel: Enum_LoadImageMask_channel,
        workflow?: ComfyWorkflowL,
    ): Promise<LoadImageMask> => {
        const img = this.createFromDataURLOrPath(relPathOrDataURL)
        return await img.loadInWorkflowAsMask(channel, workflow)
    }

    loadAsEnum = async (relPathOrDataURL: string): Promise<Enum_LoadImage_image> => {
        const img = this.createFromDataURLOrPath(relPathOrDataURL)
        return await img.uploadAndReturnEnumName()
    }

    // ----------------------------------------------------------------------------------------
    // utils to create CushyStudio `MediaImagesL` without using them directly

    createFromDataURLOrPath = (relPathOrDataURL: string): MediaImageL => {
        return relPathOrDataURL.startsWith('data:') //
            ? this.createFromDataURL(relPathOrDataURL)
            : this.createFromPath(relPathOrDataURL)
    }

    createFromURL = async (url: string): Promise<MediaImageL> => {
        const filename = url.split('/').pop() ?? 'unknown' // 🔴 bad code here
        const blob: Blob = await fetch(url).then((x) => x.blob())
        const stepID: StepID = this.rt.step.id
        return createMediaImage_fromBlobObject(cushy, blob, `outputs/imported/${filename}`, { stepID })
    }

    createFromDataURL = (
        /** base 64 encoded data URL */
        dataURL: string,
        p: { promptID?: PromptID } = {},
    ): MediaImageL => {
        const stepID: StepID = this.rt.step.id
        return createMediaImage_fromDataURI(this.rt.Cushy, dataURL, undefined, { promptID: p.promptID, stepID })
    }

    createFromPath = (relPath: string, p: { promptID?: PromptID } = {}): MediaImageL => {
        const stepID: StepID = this.rt.step.id
        return createMediaImage_fromPath(this.rt.Cushy, relPath, { promptID: p.promptID, stepID })
    }
}
