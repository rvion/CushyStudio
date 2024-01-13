import { makeAutoObservable } from 'mobx'
import { MediaImageL } from 'src/models/MediaImage'
import { createMediaImage_fromDataURI, createMediaImage_fromPath } from 'src/models/createMediaImage_fromWebFile'
import { PromptID } from 'src/types/ComfyWsApi'
import { Runtime } from './Runtime'

/** namespace for all image-related utils */
export class RuntimeImages {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }

    createFromBase64 = (base64Url: string): MediaImageL => {
        return createMediaImage_fromDataURI(this.rt.st, base64Url)
    }

    createFromBase64AsLocalPath = (base64Url: string): MediaImageL => {
        return createMediaImage_fromDataURI(this.rt.st, base64Url)
    }

    createFromPath = (path: RelativePath, p: { promptID?: PromptID }): MediaImageL => {
        const stepID = this.rt.step.id
        return createMediaImage_fromPath(this.rt.st, path, { promptID: p.promptID, stepID })
    }
}
