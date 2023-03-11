import type { ComfySpec } from './ComfySpecType'
import type { Maybe } from './ComfyUtils'

import { makeAutoObservable } from 'mobx'
import { ComfyManager } from './ComfyManager'

/** helper to instanciate a comfy manager up-to-date with latest backend setup */
export class ComfyBackendInfos {
    serverIP = '192.168.1.19'
    serverPort = 8188
    get serverHost() { return `${this.serverIP}:${this.serverPort}` } // prettier-ignore

    constructor() {
        makeAutoObservable(this)
    }

    manager: Maybe<ComfyManager>
    connect = async (): Promise<ComfyManager> => {
        const schema: ComfySpec = await this.fetchObjectsSchema()
        console.log('🚀 ~ file: ComfyBackendInfos.ts:20 ~ ComfyBackendInfos ~ connect= ~ schema:', schema)
        this.manager = new ComfyManager({
            serverIP: this.serverIP,
            serverPort: this.serverPort,
            spec: schema,
        })
        return this.manager
    }

    /** retri e the comfy spec from the schema*/
    fetchObjectsSchema = async (): Promise<ComfySpec> => {
        const x = await fetch(`http://${this.serverHost}/object_info`, {}).then((x) => x.json())
        return x
    }
}
