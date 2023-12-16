import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { resolve } from 'pathe'
import { nanoid } from 'nanoid'
import { HostT, asHostID } from 'src/db/TYPES.gen'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'

export const DEFAULT_COMFYUI_INSTANCE_ID: HostID = asHostID('default-local')

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
