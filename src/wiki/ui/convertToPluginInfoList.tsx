import { PluginInfo, getKnownPlugins } from 'src/wiki/customNodeList'
import { CustomNodeRecommandation } from '../../controls/IWidget'
import { getCustomNodeRegistry } from 'src/wiki/extension-node-map/extension-node-map-loader'

export const convertToPluginInfoList = (p: {
    recomandation: CustomNodeRecommandation
}): { reason: string; plugin: PluginInfo }[] => {
    const OUT: { reason: string; plugin: PluginInfo }[] = []
    const { customNodesByTitle, customNodesByURI, customNodesByNameInCushy } = p.recomandation

    // by titles
    if (customNodesByTitle != null) {
        const x = getKnownPlugins()
        const titles = Array.isArray(customNodesByTitle) ? customNodesByTitle : [customNodesByTitle]
        for (const title of titles) {
            const pluginInfo = x.byTitle.get(title)
            if (!pluginInfo) {
                console.log(`[🔎] ❌ no CusomNode pack found for title ${title}`)
                continue
            }
            OUT.push({ reason: `(title:${title})`, plugin: pluginInfo })
        }
    }
    // by URI
    if (customNodesByURI != null) {
        const x = getKnownPlugins()
        const uris = Array.isArray(customNodesByURI) ? customNodesByURI : [customNodesByURI]
        for (const uri of uris) {
            const pluginInfo = x.byURI.get(uri)
            if (!pluginInfo) {
                console.log(`[🔎] ❌ no CusomNode pack found for uri ${uri}`)
                continue
            }
            OUT.push({ reason: `(uri:${uri})`, plugin: pluginInfo })
        }
    }

    // by cushy name
    if (customNodesByNameInCushy != null) {
        const x = getKnownPlugins()
        const y = getCustomNodeRegistry()
        const cushyNames = Array.isArray(customNodesByNameInCushy) ? customNodesByNameInCushy : [customNodesByNameInCushy]
        for (const cushyName of cushyNames) {
            const pluginURI = y.byNodeNameInComfy.get(cushyName)
            if (!pluginURI) {
                console.log(`[🔎] ❌ no CusomNode URI found for nodeName ${cushyName}`)
                continue
            }
            const arr = Array.isArray(pluginURI) ? pluginURI : [pluginURI]
            for (const uri of arr) {
                const pluginInfo = x.byURI.get(uri)
                if (!pluginInfo) {
                    console.log(`[🔎] ❌ no CusomNode pack found for uri ${uri}`)
                    continue
                }
                OUT.push({ reason: `(node:${cushyName})`, plugin: pluginInfo })
            }
        }
    }
    return OUT
}

// // by comfy name
// if (customNodesByNameInComfy != null) {
//     const x = getKnownPlugins()
//     const y = getCustomNodeRegistry()
//     const comfyNames = Array.isArray(customNodesByNameInComfy) ? customNodesByNameInComfy : [customNodesByNameInComfy]
//     for (const comfyName of comfyNames) {
//         const pluginURI = y.byNodeNameInComfy.get(comfyName)
//         if (!pluginURI) continue
//         const arr = Array.isArray(pluginURI) ? pluginURI : [pluginURI]
//         for (const url of arr) {
//             const pluginInfo = x.byURI.get(url)
//             if (!pluginInfo) continue
//             OUT.push({ reason: `(ComfyNode:${uri})`, plugin: pluginInfo })
//         }
//     }
// }
