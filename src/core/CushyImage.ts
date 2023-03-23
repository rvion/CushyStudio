import type { ComfyImageInfo } from './ComfyAPI'
import type { ComfyClient } from './ComfyClient'

import { nanoid } from 'nanoid'

/** Cushy wrapper around ComfyImageInfo */
export class CushyImage {
    /** unique image id */
    uid = nanoid()

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
