import { makeAutoObservable } from 'mobx'
import { Runtime } from './Runtime'
import { MediaImageL } from 'src/models/MediaImage'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { PromptID } from 'src/types/ComfyWsApi'

/** namespace for all image-related utils */
export class RuntimeImages {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }

    createFromBase64 = (base64Url: string): MediaImageL => {
        return this.rt.st.db.media_images.create({
            infos: { type: 'image-base64', base64Url },
        })
    }

    createFromBase64AsLocalPath = (base64Url: string): MediaImageL => {
        return this.rt.st.db.media_images.create({
            infos: { type: 'image-base64', base64Url },
        })
    }

    createFromPath = (path: RelativePath, p: { promptID?: PromptID }): MediaImageL => {
        const stepID = this.rt.step.id
        const absPath = this.rt.st.resolveFromRoot(path)
        console.log(`[👙] `, stepID, p.promptID)
        return this.rt.st.db.media_images.create({
            infos: { type: 'image-local', absPath },
            promptID: p.promptID,
            stepID,
        })
    }
}
