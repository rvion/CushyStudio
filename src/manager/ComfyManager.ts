/** 🔶 NAMING DISCLAIMER: I call a "custom node package" => "PLUGIN" */

import type { ComfyManagerRepository } from './ComfyManagerRepository'
import type { PluginInfo } from './custom-node-list/custom-node-list-types'
import type { KnownCustomNode_Title } from './custom-node-list/KnownCustomNode_Title'
import type { KnownModel_Name } from './model-list/KnownModel_Name'
import type { ModelInfo } from './model-list/model-list-loader-types'
import type { PluginInstallStatus } from 'src/controls/REQUIREMENTS/PluginInstallStatus'
import type { HostL } from 'src/models/Host'

import { makeAutoObservable, observable } from 'mobx'

import { toastError, toastSuccess } from 'src/utils/misc/toasts'

type HostPluginList = {
    custom_nodes: {
        title: KnownCustomNode_Title
        installed: 'False' | 'True' | 'Update' /* ... */
    }[]
    chanel: 'string'
}

type HostModelList = {
    models: {
        name: KnownModel_Name
        installed: 'False' | 'True' | 'Update' /* ... */
    }[]
    // why is this not there ⁉️
    // chanel: 'string'
}

type ComfyManagerFetchPolicy =
    /** DB: Channel (1day cache)' */
    | 'cache'
    /** text: 'DB: Local' */
    | 'local'
    /** DB: Channel (remote) */
    | 'url'

export class ComfyManager {
    get repository(): ComfyManagerRepository {
        return this.host.st.managerRepository
    }

    constructor(public host: HostL) {
        makeAutoObservable(this, {
            host: false,
            repository: false,
            modelList: observable.shallow,
            pluginList: observable.shallow,
        })
        void this.updateHostPluginsAndModels()
    }
    updateHostPluginsAndModels = async () => {
        this.pluginList = await this.fetchPluginList()
        this.modelList = await this.fetchModelList()
    }

    // utils ------------------------------------------------------------------------------
    getModelInfoFinalFilePath = (mi: ModelInfo): string => {
        return this.repository.getModelInfoFinalFilePath(mi)
    }

    // actions ---------------------------------------------------------------------------
    // @server.PromptServer.instance.routes.get("/manager/reboot")
    rebootComfyUI = async () => {
        // 🔴 bad code
        setTimeout(() => void this.updateHostPluginsAndModels(), 10_000)

        return this.fetchGet('/manager/reboot')
    }

    // models --------------------------------------------------------------
    modelList: Maybe<HostModelList> = null

    fetchModelList = (): Promise<HostModelList> => {
        return this.fetchGet<HostModelList>('/externalmodel/getlist?mode=cache')
    }

    isModelInstalled = (name: KnownModel_Name): boolean => {
        return this.modelList?.models.some((x) => x.name === name && x.installed === 'True') ?? false
    }

    modelsBeeingInstalled = new Set<KnownModel_Name>()

    installModel = async (model: ModelInfo) => {
        try {
            this.modelsBeeingInstalled.add(model.name)
            const status = await this.fetchPost('/model/install', model)
            this.modelsBeeingInstalled.delete(model.name)
            toastSuccess('Model installed')
            return true
        } catch (exception) {
            console.error(`Install failed: ${/*model.title*/ ''} / ${exception}`)
            toastError('Model Installation Failed')
            this.modelsBeeingInstalled.delete(model.name)
            return false
        }
    }
    getModelStatus = (modelName: KnownModel_Name): PluginInstallStatus => {
        if (this.modelList == null) return 'unknown'
        const entry = this.modelList?.models.find((x) => x.name === modelName)
        const status = ((): PluginInstallStatus => {
            if (!entry) return 'unknown'
            if (entry?.installed === 'False') return 'not-installed'
            if (entry?.installed === 'True') return 'installed'
            if (entry?.installed === 'Update') return 'update-available'
            return 'error'
        })()
        return status
    }

    // PLUGINS (A.K.A. Custom nodes) ----------------------------------------------------------------------------
    pluginList: Maybe<HostPluginList> = null // hasModel = async (model: ModelInfo) => {

    get titlesOfAllInstalledPlugins(): KnownCustomNode_Title[] {
        return (
            this.pluginList?.custom_nodes //
                .filter((x) => x.installed === 'True')
                .map((x) => x.title) ?? []
        )
    }

    isPluginInstalled = (title: KnownCustomNode_Title): boolean => {
        return this.pluginList?.custom_nodes.some((x) => x.title === title && x.installed === 'True') ?? false
    }

    getPluginStatus = (title: KnownCustomNode_Title): PluginInstallStatus => {
        if (this.pluginList == null) return 'unknown'
        const entry = this.pluginList?.custom_nodes.find((x) => x.title === title)
        const status = ((): PluginInstallStatus => {
            if (!entry) return 'unknown'
            if (entry?.installed === 'False') return 'not-installed'
            if (entry?.installed === 'True') return 'installed'
            if (entry?.installed === 'Update') return 'update-available'
            return 'error'
        })()
        return status
    }

    // --------------------------------------------------------------
    // https://github.com/ltdrdata/ComfyUI-Manager/blob/4649d216b1842aa48b95d3f064c679a1b698e506/js/custom-nodes-downloader.js#L14C25-L14C88
    fetchPluginList = async (
        /** @default: 'cache' */
        mode: ComfyManagerFetchPolicy = 'cache',
        /** @default: true */
        skipUpdate: boolean = true,
    ): Promise<HostPluginList> => {
        try {
            const skip_update = skipUpdate ? '&skip_update=true' : ''
            const status = await this.fetchGet(`/customnode/getlist?mode=${mode}${skip_update}`)
            return status as any
        } catch (exception) {
            console.error(`node list retrieval failed: ${exception}`)
            toastError('node list retrieveal failed')
            throw exception
        }
    }

    installPlugin = async (model: PluginInfo) => {
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

    // --------------------------------------------------------------
    private fetchPost = async <In, Out>(endopint: string, body: In): Promise<boolean> => {
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

    private fetchGet = async <Out>(endopint: string): Promise<Out> => {
        const url = this.host.getServerHostHTTP() + endopint
        const response = await fetch(url)
        const status = await response.json()
        console.log(`[👀]`, status)
        return status
    }
}
