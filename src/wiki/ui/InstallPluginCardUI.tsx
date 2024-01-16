import { observer } from 'mobx-react-lite'
import { useSt } from 'src/state/stateContext'
import { PluginInfo } from 'src/wiki/customNodeList'
import { useAsyncAction } from 'src/importers/usePromise'

export type PluginInstallStatus = 'installed' | 'not-installed' | 'update-available' | 'unknown' | 'error'

const renderStatus = (status: PluginInstallStatus) => {
    if (status === 'installed') return <span tw='text-green-500'>Installed</span>
    if (status === 'not-installed') return <span tw='text-red-500'>Custom Nodes Required</span>
    if (status === 'update-available') return <span tw='text-yellow-500'>Update Available</span>
    if (status === 'unknown') return <span tw='text-gray-500'>Unknown</span>
    if (status === 'error') return <span tw='text-red-500'>❌ Error (a)</span>
    return <span tw='text-red-500'>❌ Error (b)</span>
}

export const InstallPluginCardUI = observer(function InstallPluginCardUI_(p: {
    //
    status: PluginInstallStatus
    reason: string
    plugin: PluginInfo
}) {
    const st = useSt()
    const { plugin, reason } = p
    const host = st.mainHost
    const isInstalled = p.status === 'installed'
    const action = useAsyncAction(() => host.getComfyUIManager()?.installCustomNode(plugin), [])
    return (
        <div
            //
            key={plugin.title}
            tw={[isInstalled ? 'bg-success-1' : null, 'max-w-96 flex flex-col virtualBorder p-2']}
        >
            <div>
                <span className='font-bold text-primary p-1'>{plugin.title}</span>
                {renderStatus(p.status)}
                {/* {isInstalled ? <span tw='text-green-500'>Installed</span> : <span tw='text-red-500'>Custom Nodes Required</span>} */}
            </div>
            {!isInstalled && (
                <div
                    tw={['btn btn-sm btn-outline btn-sm', action.isRunning ? 'btn-disabled' : null]}
                    onClick={() => action.start()}
                >
                    {action.isRunning ? <div tw='loading loading-spinner' /> : null}
                    {isInstalled ? '✅' : null}
                    <span className='material-symbols-outlined'>cloud_download</span>
                    Install
                </div>
            )}

            {!isInstalled && (
                <span tw='italic text-sm opacity-75'>
                    {plugin.description} (via {plugin.install_type})
                </span>
            )}

            {/* {showDescription && <span tw='italic text-sm opacity-75'>why ? author: {reason}</span>} */}
        </div>
    )
})
