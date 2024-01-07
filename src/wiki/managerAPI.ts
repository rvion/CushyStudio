import { HostL } from 'src/models/Host'
import { ModelInfo, getModelInfoFinalFilePath } from './modelList'
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

    installCustomNode = async (model: ModelInfo) => {
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
