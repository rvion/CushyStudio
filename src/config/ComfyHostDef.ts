import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { resolve } from 'pathe'
import { nanoid } from 'nanoid'

export type ComfyHostID = Branded<string, { ComfyUIHostID: true }>

export type ComfyHostDef = {
    /** unique host id */
    id: ComfyHostID

    /** server name; just for you to remember which is which */
    name?: string

    /** e.g.
     * @example localhost
     * @example 192.168.0.19
     * */
    hostname: string

    /** e.g.
     * @example 8188
     * */
    port: number

    /** true if on the same machine */
    isLocal?: boolean

    /** local path to this machine ComfyUI folder, if this ComfyUI installation is local */
    localPath?: string

    /** e.g.
     *  whether to use https:// or http://
     *  @default false
     * - true
     *   => will use https:// for POST requests
     *   => will use wss:// for websocket connections
     * - false
     *   => will use http:// for POST requests
     *   => will use ws:// for websocket connections
     * */
    useHttps?: boolean
}

export const DEFAULT_COMFYUI_INSTANCE_ID: ComfyHostID = 'default-local' as ComfyHostID

export const mkDefaultHost = (): ComfyHostDef => ({
    id: DEFAULT_COMFYUI_INSTANCE_ID,
    hostname: 'localhost',
    useHttps: false,
    port: 8188,
    name: 'local',
    isLocal: true,
    localPath: asAbsolutePath(resolve('comfy')),
})

export const defaultHost = Object.freeze(mkDefaultHost())

export const mkLocalNetworkHostConfig = (): ComfyHostDef => ({
    id: nanoid(4) as ComfyHostID,
    hostname: '192.168.1.19',
    port: 8188,
    name: '192.168.1.19',
    isLocal: false,
    useHttps: false,
    localPath: asAbsolutePath(resolve('comfy')),
})

export const mkCloudHostConfig = (): ComfyHostDef => {
    const id = nanoid(4) as ComfyHostID
    return {
        id,
        name: `M${id}`,
        hostname: `CushyStudio.com/gpu/${id}`,
        port: 443,
        isLocal: false,
        useHttps: true,
        localPath: asAbsolutePath(resolve('comfy')),
    }
}
