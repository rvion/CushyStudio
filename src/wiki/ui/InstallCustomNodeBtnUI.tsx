import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { PluginInfo } from 'src/wiki/customNodeList'
import { CustomNodeRecommandation } from '../../controls/IWidget'
import { convertToPluginInfoList } from './convertToPluginInfoList'
import { usePromise } from 'src/utils/misc/usePromise'

export const InstallCustomNodeBtnUI = observer(function InstallCustomNodeBtnUI_<K extends KnownEnumNames>(p: {
    recomandation: CustomNodeRecommandation
}) {
    const plugins: { reason: string; plugin: PluginInfo }[] = convertToPluginInfoList(p)
    if (plugins.length === 0) return <pre>🔴{JSON.stringify(p)}</pre>
    return (
        <RevealUI>
            <div tw='btn btn-square btn-sm'>
                <span className='material-symbols-outlined'>cloud_download</span>
            </div>
            <RelatedPluginsUI recomandation={p.recomandation} />
        </RevealUI>
    )
})

export const RelatedPluginsUI = observer(function RelatedPluginsUI_(p: { recomandation: CustomNodeRecommandation }) {
    const plugins: { reason: string; plugin: PluginInfo }[] = convertToPluginInfoList(p)
    if (plugins.length === 0) return <pre>🔴{JSON.stringify(p)}</pre>

    const st = useSt()
    const foo = usePromise(() => st.mainHost.getComfyUIManager()?.getNodeList(), [])
    console.log(`[👙] 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`, foo)
    return (
        <div tw='flex flex-col flex-wrap gap-1'>
            {/* {models.length} */}
            {/* <pre>{JSON.stringify(p.widget.input.default)}</pre> */}
            {plugins.map(({ plugin, reason }, ix) => {
                const entry = foo?.value?.custom_nodes.find((x) => x.title === plugin.title)
                const status = ((): PluginInstallStatus => {
                    if (!entry) return 'unknown'
                    if (entry?.installed === 'False') return 'not-installed'
                    if (entry?.installed === 'True') return 'installed'
                    if (entry?.installed === 'Update') return 'update-available'
                    return 'error'
                })()
                return (
                    <PluginInstallUI
                        //
                        status={status}
                        key={ix}
                        plugin={plugin}
                        reason={reason}
                    />
                )
            })}
        </div>
    )
})

type PluginInstallStatus = 'installed' | 'not-installed' | 'update-available' | 'unknown' | 'error'

const renderStatus = (status: PluginInstallStatus) => {
    if (status === 'installed') return <span tw='text-green-500'>Installed</span>
    if (status === 'not-installed') return <span tw='text-red-500'>Custom Nodes Required</span>
    if (status === 'update-available') return <span tw='text-yellow-500'>Update Available</span>
    if (status === 'unknown') return <span tw='text-gray-500'>Unknown</span>
    if (status === 'error') return <span tw='text-red-500'>❌ Error (a)</span>
    return <span tw='text-red-500'>❌ Error (b)</span>
}

export const PluginInstallUI = observer(function PluginInstallUI_(p: {
    //
    status: PluginInstallStatus
    reason: string
    plugin: PluginInfo
}) {
    const st = useSt()
    const { plugin, reason } = p
    const isInstalled = false // 🔴 p.widget.possibleValues.find((x) => x === enumName.nix || x === enumName.win)
    const host = st.mainHost
    return (
        <div key={plugin.title} tw='max-w-96 flex flex-col'>
            <div>
                <span className='font-bold text-primary p-1'>{plugin.title}</span>
                {renderStatus(p.status)}
                {/* {isInstalled ? <span tw='text-green-500'>Installed</span> : <span tw='text-red-500'>Custom Nodes Required</span>} */}
            </div>
            <div
                onClick={async () => {
                    const promise = await host.getComfyUIManager()?.installCustomNode(plugin)

                    const res = await promise
                    if (!res) return
                }}
                tw='btn btn-sm btn-outline btn-sm'
            >
                {reason}
                {isInstalled ? '✅' : null}
                <span className='material-symbols-outlined'>cloud_download</span>
                Télécharger
            </div>
            <span>{plugin.description}</span>
        </div>
    )
})
