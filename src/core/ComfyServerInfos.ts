// import { ComfySchemaJSON } from './ComfySchemaJSON'
// import type { Maybe } from './ComfyUtils'

// import { makeAutoObservable } from 'mobx'
// import { ComfyClient } from './ComfyClient'

/** helper to instanciate a comfy manager up-to-date with latest backend setup */
// export class ComfyServerInfos {
//     serverIP = '192.168.1.19'
//     serverPort = 8188
//     get serverHost() { return `${this.serverIP}:${this.serverPort}` } // prettier-ignore

//     constructor() {
//         makeAutoObservable(this)
//     }

//     client: Maybe<ComfyClient>
//     connect = async (): Promise<ComfyClient> => {
//         const schema: ComfySchemaJSON = await this.fetchObjectsSchema2()
//         console.log('🚀 ~ file: ComfyBackendInfos.ts:20 ~ ComfyBackendInfos ~ connect= ~ schema:', schema)
//         this.client = new ComfyClient({
//             serverIP: this.serverIP,
//             serverPort: this.serverPort,
//             spec: schema,
//         })
//         return this.client
//     }
//     /** retri e the comfy spec from the schema*/
//     fetchObjectsSchema2 = async (): Promise<ComfySchemaJSON> => {
//         const base = window.location.href
//         const res = await fetch(`${base}/object_infos.json`, {})
//         return res.json()
//     }

//     /** retri e the comfy spec from the schema*/
//     fetchObjectsSchema = async (): Promise<ComfySchemaJSON> => {
//         const res = await fetch(`http://${this.serverHost}/object_info`, {})
//         return res.json()
//     }
// }

export const x = 1
