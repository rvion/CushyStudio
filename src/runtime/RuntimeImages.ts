import type { ComfyWorkflowL } from '../models/ComfyWorkflow'
import type { MediaImageL } from '../models/MediaImage'
import type { PromptID } from '../types/ComfyWsApi'
import type { Runtime } from './Runtime'

import { makeAutoObservable } from 'mobx'

import {
    createMediaImage_fromBlobObject,
    createMediaImage_fromDataURI,
    createMediaImage_fromPath,
} from '../models/createMediaImage_fromWebFile'
import { type FilepathExt, FPath } from '../models/PathObj'

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

    createFromDataURLOrPath = (pathOrDataURL: string): MediaImageL => {
        return pathOrDataURL.startsWith('data:') //
            ? this.createFromDataURL(pathOrDataURL)
            : this.createFromPath(pathOrDataURL)
    }

    createFromURL = async (url: string): Promise<MediaImageL> => {
        const filename = url.split('/').pop() ?? 'unknown' // 🔴 bad code here
        const blob: Blob = await fetch(url).then((x) => x.blob())
        const stepID: StepID = this.rt.step.id
        return createMediaImage_fromBlobObject(blob, new FPath(`outputs/imported/${filename}`), { stepID })
    }

    createFromDataURL = (
        /** base 64 encoded data URL */
        dataURL: string,
        p: { promptID?: PromptID } = {},
    ): MediaImageL => {
        const stepID: StepID = this.rt.step.id
        return createMediaImage_fromDataURI(dataURL, undefined, { promptID: p.promptID, stepID })
    }

    createFromPath = (
        /** string path */
        path: string,
        p: { promptID?: PromptID } = {},
    ): MediaImageL => {
        const stepID: StepID = this.rt.step.id
        return createMediaImage_fromPath(new FPath(path), { promptID: p.promptID, stepID })
    }
}
