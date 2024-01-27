import type { HostL } from 'src/models/Host'
import type { ModelInfo } from '../modelList'
import type { PluginInfo } from '../customNodeList'

import { getModelInfoFinalFilePath } from '../modelList'
import { toastError, toastSuccess } from 'src/utils/misc/toasts'

export class ComfyUIManager {
    constructor(public host: HostL) {}

    getModelInfoFinalFilePath = (mi: ModelInfo): string => {
        return getModelInfoFinalFilePath(mi)
    }

    // downloadModel = async (model: ModelInfo) => {
    //     try {
    //         const status = await this.fetchPost('/model/download', model)
    //         toastSuccess('Model installed')
    //         return true
    //     } catch (exception) {
    //         console.error(`Install failed: ${/*model.title*/ ''} / ${exception}`)
    //         toastSuccess('Model Installation Failed')
    //         return false
    //     }
    // }

    rebootComfyUI = async () => {
        // @server.PromptServer.instance.routes.get("/manager/reboot")
        return this.fetchGet('/manager/reboot')
    }

    getCachedModels = (): Promise<ModelInfo[]> => {
        return this.fetchGet<ModelInfo[]>('/externalmodel/getlist?mode=cache')
    }

    installModel = async (model: ModelInfo) => {
        try {
            const status = await this.fetchPost('/model/install', model)
            toastSuccess('Model installed')
            return true
        } catch (exception) {
            console.error(`Install failed: ${/*model.title*/ ''} / ${exception}`)
            toastError('Model Installation Failed')
            return false
        }
    }

    nodeList: Maybe<{
        custom_nodes: {
            title: string
            installed: 'False' | 'True' | 'Update' /* ... */
        }[]
        chanel: 'string'
    }> = null

    // https://github.com/ltdrdata/ComfyUI-Manager/blob/4649d216b1842aa48b95d3f064c679a1b698e506/js/custom-nodes-downloader.js#L14C25-L14C88
    getNodeList = async (
        // prettier-ignore
        /** @default: 'cache' */
        mode:
            /** DB: Channel (1day cache)' */
            | 'cache'
            /** text: 'DB: Local' */
            | 'local'
            /** DB: Channel (remote) */
            | 'url'
            ='cache',
        /** @default: true */
        skipUpdate: boolean = true,
    ): Promise<{
        custom_nodes: {
            title: string
            installed: 'False' | 'True' | 'Update' /* ... */
        }[]
        chanel: 'string'
    }> => {
        try {
            const skip_update = skipUpdate ? '&skip_update=true' : ''
            const status = await this.fetchGet(`/customnode/getlist?mode=${mode}${skip_update}`)
            this.nodeList = status as any
            return status as any
        } catch (exception) {
            console.error(`node list retrieval failed: ${exception}`)
            toastError('node list retrieveal failed')
            throw exception
        }
    }

    installCustomNode = async (model: PluginInfo) => {
        try {
            const status = await this.fetchPost('/customnode/install', model)
            toastSuccess('Custom Node installed')
            return true
        } catch (exception) {
            console.error(`Install failed: ${/*model.title*/ ''} / ${exception}`)
            toastError('Custom Node Installation Failed')
            return false
        }
    }

    private fetchPost = async <In, Out>(
        //
        endopint: string,
        body: In,
    ): Promise<boolean> => {
        const url = this.host.getServerHostHTTP() + endopint
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        const status = await response.json()
        console.log(`[👀]`, status)
        return status
    }

    private fetchGet = async <Out>(
        //
        endopint: string,
    ): Promise<Out> => {
        const url = this.host.getServerHostHTTP() + endopint
        const response = await fetch(url)
        const status = await response.json()
        console.log(`[👀]`, status)
        return status
    }
}
