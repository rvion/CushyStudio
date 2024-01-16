import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { STATE } from 'src/state/state'
import { useSt } from 'src/state/stateContext'
import { PluginInfo, getKnownPlugins } from 'src/wiki/customNodeList'
import { ComfyUIManagerKnownCustomNode_Files, ComfyUIManagerKnownCustomNode_Title } from 'src/wiki/customNodeListTypes'
import { CustomNodeRecommandation } from '../IWidget'
import { getCustomNodeRegistry } from 'src/wiki/extension-node-map/extension-node-map-loader'

const convertToPluginInfoList = (p: { recomandation: CustomNodeRecommandation }): PluginInfo[] => {
    const OUT = [] as PluginInfo[]
    const { customNodesByTitle, customNodesByURI, customNodesByNameInComfy, customNodesByNameInCushy } = p.recomandation

    // by titles
    if (customNodesByTitle != null) {
        const x = getKnownPlugins()
        const titles = Array.isArray(customNodesByTitle) ? customNodesByTitle : [customNodesByTitle]
        for (const title of titles) {
            const pluginInfo = x.byTitle.get(title)
            if (!pluginInfo) continue
            OUT.push(pluginInfo)
        }
    }
    // by URI
    if (customNodesByURI != null) {
        const x = getKnownPlugins()
        const uris = Array.isArray(customNodesByURI) ? customNodesByURI : [customNodesByURI]
        for (const uri of uris) {
            const pluginInfo = x.byURI.get(uri)
            if (!pluginInfo) continue
            OUT.push(pluginInfo)
        }
    }

    // by comfy name
    if (customNodesByNameInComfy != null) {
        const x = getKnownPlugins()
        const y = getCustomNodeRegistry()
        const comfyNames = Array.isArray(customNodesByNameInComfy) ? customNodesByNameInComfy : [customNodesByNameInComfy]
        for (const comfyName of comfyNames) {
            const pluginURI = y.byNodeNameInComfy.get(comfyName)
            if (!pluginURI) continue
            const arr = Array.isArray(pluginURI) ? pluginURI : [pluginURI]
            for (const url of arr) {
                const pluginInfo = x.byURI.get(url)
                if (!pluginInfo) continue
                OUT.push(pluginInfo)
            }
        }
    }

    // by cushy name
    if (customNodesByNameInCushy != null) {
        const x = getKnownPlugins()
        const y = getCustomNodeRegistry()
        const cushyNames = Array.isArray(customNodesByNameInCushy) ? customNodesByNameInCushy : [customNodesByNameInCushy]
        for (const cushyName of cushyNames) {
            const pluginURI = y.byNodeNameInComfy.get(cushyName)
            if (!pluginURI) continue
            const arr = Array.isArray(pluginURI) ? pluginURI : [pluginURI]
            for (const url of arr) {
                const pluginInfo = x.byURI.get(url)
                if (!pluginInfo) continue
                OUT.push(pluginInfo)
            }
        }
    }
    return OUT
}

export const InstallCustomNodeBtnUI = observer(function InstallCustomNodeBtnUI_<K extends KnownEnumNames>(p: {
    recomandation: CustomNodeRecommandation
}) {
    const st = useSt()
    const plugins: PluginInfo[] = convertToPluginInfoList(p)
    if (plugins.length === 0) return <pre>🔴{JSON.stringify(p)}</pre>
    return (
        <RevealUI>
            <div tw='btn btn-square btn-sm'>
                <span className='material-symbols-outlined'>cloud_download</span>
            </div>
            <div tw='flex flex-col flex-wrap gap-1'>
                {/* {models.length} */}
                {/* <pre>{JSON.stringify(p.widget.input.default)}</pre> */}
                {plugins.map((plugin) => {
                    const isInstalled = false // 🔴 p.widget.possibleValues.find((x) => x === enumName.nix || x === enumName.win)
                    const host = st.mainHost
                    // const rootComfyUIFolder = host.absolutPathToDownloadModelsTo
                    // const dlPath = host.getComfyUIManager()?.getModelInfoFinalFilePath(mi)
                    return (
                        <div key={plugin.title} tw='max-w-96 flex flex-col'>
                            <div>
                                <span className='font-bold text-primary p-1'>{plugin.title}</span>
                                {isInstalled ? (
                                    <span tw='text-green-500'>Installed</span>
                                ) : (
                                    <span tw='text-red-500'>Custom Nodes Required</span>
                                )}
                            </div>
                            <div
                                onClick={async () => {
                                    const promise = await host.getComfyUIManager()?.installCustomNode(plugin)

                                    const res = await promise
                                    if (!res) return
                                }}
                                tw='btn btn-sm btn-outline btn-sm'
                            >
                                {isInstalled ? '✅' : null}
                                <span className='material-symbols-outlined'>cloud_download</span>
                                Télécharger
                            </div>
                            <span>{plugin.description}</span>
                        </div>
                    )
                })}
            </div>
        </RevealUI>
    )
})
