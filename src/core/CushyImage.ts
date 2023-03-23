import type { ComfyImageInfo } from './ComfyAPI'
import type { ComfyClient } from './CushyClient'
import type { Maybe } from './ComfyUtils'

import { nanoid } from 'nanoid'

/** Cushy wrapper around ComfyImageInfo */
export class CushyImage {
    /** unique image id */
    uid = nanoid()

    /** path within the input folder */
    inputPath?: Maybe<string> = null

    /** this is such a bad workaround but 🤷‍♂️ */
    makeAvailableAsInput = async (): Promise<string> => {
        const res = await this.client.uploadURL(this.url)
        console.log(`[makeAvailableAsInput]`, res)
        this.inputPath = res.name
        return res.name
    }

    constructor(
        //
        public client: ComfyClient,
        public data: ComfyImageInfo,
    ) {}

    /** url to acces the image */
    get url() {
        return this.client.serverHostHTTP + '/view?' + new URLSearchParams(this.data).toString()
    }
}
