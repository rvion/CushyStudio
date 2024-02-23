import type { Runtime } from './Runtime'
import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import type { MediaImageL } from 'src/models/MediaImage'
import type { PromptID } from 'src/types/ComfyWsApi'

import { makeAutoObservable } from 'mobx'

import { createMediaImage_fromDataURI, createMediaImage_fromPath } from 'src/models/createMediaImage_fromWebFile'

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

    createFromDataURL = (
        /** base 64 encoded data URL */
        dataURL: string,
    ): MediaImageL => {
        return createMediaImage_fromDataURI(this.rt.Cushy, dataURL)
    }

    createFromPath = (relPath: string, p: { promptID?: PromptID } = {}): MediaImageL => {
        const stepID = this.rt.step.id
        return createMediaImage_fromPath(this.rt.Cushy, relPath, { promptID: p.promptID, stepID })
    }
}
