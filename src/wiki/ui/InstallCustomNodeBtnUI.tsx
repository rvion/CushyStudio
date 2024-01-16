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
    const st = useSt()
    return (
        <RevealUI>
            <div tw='btn btn-square btn-sm'>
                <span className='material-symbols-outlined'>cloud_download</span>
            </div>

            <div tw='flex flex-col flex-wrap gap-1'>
                {/* {models.length} */}
                {/* <pre>{JSON.stringify(p.widget.input.default)}</pre> */}
                {plugins.map(({ plugin, reason }, ix) => (
                    <PluginInstallUI key={ix} plugin={plugin} reason={reason} />
                ))}
            </div>
        </RevealUI>
    )
})

export const PluginInstallUI = observer(function PluginInstallUI_(p: { reason: string; plugin: PluginInfo }) {
    const st = useSt()
    const { plugin, reason } = p
    const isInstalled = false // 🔴 p.widget.possibleValues.find((x) => x === enumName.nix || x === enumName.win)
    const host = st.mainHost
    return (
        <div key={plugin.title} tw='max-w-96 flex flex-col'>
            <div>
                <span className='font-bold text-primary p-1'>{plugin.title}</span>
                {isInstalled ? <span tw='text-green-500'>Installed</span> : <span tw='text-red-500'>Custom Nodes Required</span>}
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
