import { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from './ComfyUtils'

import { makeAutoObservable } from 'mobx'
import { ComfyClient } from './ComfyClient'

/** helper to instanciate a comfy manager up-to-date with latest backend setup */
export class ComfyServerInfos {
    serverIP = '192.168.1.19'
    serverPort = 8188
    get serverHost() { return `${this.serverIP}:${this.serverPort}` } // prettier-ignore

    constructor() {
        makeAutoObservable(this)
    }

    manager: Maybe<ComfyClient>
    connect = async (): Promise<ComfyClient> => {
        const schema: ComfySchemaJSON = await this.fetchObjectsSchema()
        console.log('🚀 ~ file: ComfyBackendInfos.ts:20 ~ ComfyBackendInfos ~ connect= ~ schema:', schema)
        this.manager = new ComfyClient({
            serverIP: this.serverIP,
            serverPort: this.serverPort,
            spec: schema,
        })
        return this.manager
    }

    /** retri e the comfy spec from the schema*/
    fetchObjectsSchema = async (): Promise<ComfySchemaJSON> => {
        const x = await fetch(`http://${this.serverHost}/object_info`, {}).then((x) => x.json())
        return x
    }
}
