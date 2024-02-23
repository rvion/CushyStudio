import type { PluginInfo } from './custom-node-list/custom-node-list-types'
import type { KnownCustomNode_File } from './custom-node-list/KnownCustomNode_File'
import type { KnownCustomNode_Title } from './custom-node-list/KnownCustomNode_Title'
import type { KnownModel_Name } from './model-list/KnownModel_Name'
import type { ModelInfo } from './model-list/model-list-loader-types'
import type { KnownCustomNode_CushyName } from 'src/manager/extension-node-map/KnownCustomNode_CushyName'
import type { NodeNameInComfy, NodeNameInCushy } from 'src/models/Schema'

import { _getKnownPlugins } from './custom-node-list/custom-node-list-loader'
import { _getKnownModels } from './model-list/model-list-loader'
import { _getCustomNodeRegistry } from 'src/manager/extension-node-map/extension-node-map-loader'

export class ComfyManagerRepository {
    plugins_byTitle = new Map<KnownCustomNode_Title, PluginInfo>()
    plugins_byFile = new Map<KnownCustomNode_File, PluginInfo>()
    plugins_byNodeNameInComfy = new Map<NodeNameInComfy, PluginInfo[]>()
    plugins_byNodeNameInCushy = new Map<NodeNameInCushy, PluginInfo[]>()
    customNodes_byPluginName = new Map<KnownCustomNode_Title, KnownCustomNode_CushyName[]>()
    knownModels = new Map<KnownModel_Name, ModelInfo>()

    constructor(
        public opts: {
            //
            check?: boolean
            genTypes?: boolean
        } = {},
    ) {
        this.plugins_byFile.set('https://github.com/comfyanonymous/ComfyUI' as any, {
            author: 'comfyanonymous',
            description: 'built-in',
            title: 'built-in' as any,
            files: [],
            reference: '',
            install_type: '',
        })
        _getKnownPlugins(this)
        _getCustomNodeRegistry(this)
        _getKnownModels(this)
    }

    getKnownCheckpoints = (): ModelInfo[] => {
        // for (const mi of knownModels.values()) {
        //     console.log(`[👙] `, mi.type === 'checkpoint' ? '✅' : '❌', mi.name)
        // }
        return [...this.knownModels.values()].filter((i) => i.type === 'checkpoints')
    }

    /**
     * try to replicate the logic of ComfyUIManager to extract the final
     * file path of a downloaded managed model
     */
    getModelInfoFinalFilePath = (mi: ModelInfo): string => {
        /**
         * the wide data-lt once told:
         *
         * | if save_path is 'default'
         * | models/type'/filename
         *
         * | if type is "checkpoint"
         * | models/checkpoints/filename
         *
         * | if save_path not starting with custom node
         * | base path is models
         * | e.g. save_path is "checkpoints/SD1.5"
         * | models/checkpoints/SD1.5/filename
         * | save_path is "custom_nodes/AAA/models"
         * | custom_nodes/AAA/models/filename
         *
         */
        if (mi.save_path === 'default') return `models/${mi.type}/${mi.filename}`
        if (mi.type === 'checkpoints') return `models/checkpoints/${mi.filename}`
        if (mi.save_path.startsWith('custom_nodes')) return `${mi.save_path}/${mi.filename}`
        else return `models/${mi.save_path}/${mi.filename}`
    }

    getModelInfoEnumName = (mi: ModelInfo, prefix: string = ''): { win: string; nix: string } => {
        const relPath = this.getModelInfoFinalFilePath(mi)

        const winPath = relPath.replace(/\//g, '\\')
        const winPrefix = prefix?.replace(/\//g, '\\')
        const isUnderPrefixWin = winPath.startsWith(winPrefix)

        const nixPath = relPath.replace(/\\/g, '/')
        const nixPrefix = prefix?.replace(/\//g, '\\')
        const isUnderPrefixNix = nixPath.startsWith(nixPrefix)

        const isUnderPrefix = isUnderPrefixNix || isUnderPrefixWin
        return {
            win: isUnderPrefix ? winPath.slice(winPrefix.length) : mi.filename /* winRel */,
            nix: isUnderPrefix ? nixPath.slice(nixPrefix.length) : mi.filename /* nixRel */,
        }
    }
    //
    //
}

// getPluginsContaintingNode = (nodeNameInCushy: KnownCustomNode_CushyName): PluginInfo[] => {
//     const x = _getKnownPlugins()
//     const y = getCustomNodeRegistry()
//     // const cushyNames = Array.isArray(customNodesByNameInCushy) ? customNodesByNameInCushy : [customNodesByNameInCushy]
//     // for (const cushyName of cushyNames) {
//     const pluginURI = y.byNodeNameInCushy.get(nodeNameInCushy)
//     if (!pluginURI) {
//         console.log(`[🔎] ❌ no CustomNode URI found for nodeName ${nodeNameInCushy}`)
//         console.log(
//             `[👙] `,
//             [...y.byNodeNameInCushy.keys()].filter((x) => x.includes('Cloud')),
//         )
//         return []
//     }
//     const arr = Array.isArray(pluginURI) ? pluginURI : [pluginURI]
//     const out: PluginInfo[] = []
//     for (const uri of arr) {
//         const pluginInfo = this.plugins_byFile.get(uri)
//         if (!pluginInfo) {
//             console.log(`[🔎] ❌ no CustomNode pack found for uri ${uri}`)
//             continue
//         }
//         out.push(pluginInfo)
//     }
//     return out
// }
