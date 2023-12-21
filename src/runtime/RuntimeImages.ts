import { makeAutoObservable } from 'mobx'
import { Runtime } from './Runtime'
import { MediaImageL } from 'src/models/MediaImage'

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
}
