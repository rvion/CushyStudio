import { asHostID } from '../db/TYPES.gen'

export const vIRTUAL_HOST_ID__BASE: HostID = asHostID('virtual-base')
export const vIRTUAL_HOST_ID__FULL: HostID = asHostID('virtual-full')
export const STANDARD_HOST_ID: HostID = asHostID('standard')

// export type ComfyHostID = Branded<string, { ComfyUIHostID: true }>

// export type ComfyHostDef = {
//     /** unique host id */
//     id: ComfyHostID

//     /** server name; just for you to remember which is which */
//     name?: string

//     /** e.g.
//      * @example localhost
//      * @example 192.168.0.19
//      * */
//     hostname: string

//     /** e.g.
//      * @example 8188
//      * */
//     port: number

//     /** true if on the same machine */
//     isLocal?: boolean

//     /** local path to this machine ComfyUI folder, if this ComfyUI installation is local */
//     localPath?: string

//     /** e.g.
//      *  whether to use https:// or http://
//      *  @default false
//      * - true
//      *   => will use https:// for POST requests
//      *   => will use wss:// for websocket connections
//      * - false
//      *   => will use http:// for POST requests
//      *   => will use ws:// for websocket connections
//      * */
//     useHttps?: boolean
// }
