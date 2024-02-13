import type { PluginInfo } from 'src/manager/custom-node-list/custom-node-list-types'

import { observer } from 'mobx-react-lite'
import { useAsyncAction } from 'src/importers/usePromise'
import { useSt } from 'src/state/stateContext'
import { PluginInstallStatus } from './PluginInstallStatus'

export const Button_InstallCustomNodeUI = observer(function Button_InstallCustomNodeUI_(p: {
    //
    // status: PluginInstallStatus
    reason: string
    plugin: PluginInfo
}) {
    const st = useSt()
    const { plugin, reason } = p
    const host = st.mainHost
    const pluginStatus = host.manager.getPluginStatus(p.plugin.title)
    const isInstalled = pluginStatus === 'installed'
    const action = useAsyncAction(() => host.manager.installPlugin(plugin), [])
    return (
        <div tw={[isInstalled ? 'bg-success-1' : null, 'flex flex-col virtualBorder p-2 bg-base-100 rounded']}>
            <div tw='flex items-center'>
                <span tw='font-bold whitespace-nowrap text-xl text-blue-500'>
                    <span className='material-symbols-outlined'>account_tree</span>
                </span>
                <span className='font-bold text-primary p-1'>NODES: {plugin.title}</span>
                {renderStatus(pluginStatus)}
                {/* {isInstalled ? <span tw='text-green-500'>Installed</span> : <span tw='text-red-500'>Custom Nodes Required</span>} */}
                <div className='flex-1'></div>
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
            </div>
            <span tw='italic text-sm opacity-75 line-clamp-2'>
                {plugin.description}
                {/* TODO: show install method by icon? */}
                {/* (via {plugin.install_type}) */}
            </span>
            <details>
                <summary>see all noes</summary>
                <div tw='flex gap-1'>
                    <div tw='font-bold'>Author:</div>
                    <div tw='opacity-75'>{plugin.author}</div>
                    {/* <div>{getCustomNodeRegistry()}</div> */}
                    {/* <pre>{JSON.stringify(host.manager.knownNodeList, null, 3)}</pre> */}
                </div>
            </details>

            {/* {showDescription && <span tw='italic text-sm opacity-75'>why ? author: {reason}</span>} */}
        </div>
    )
})

const renderStatus = (status: PluginInstallStatus) => {
    if (status === 'installed') return <span tw='text-green-500'>Installed</span>
    if (status === 'not-installed') return <span tw='text-red-500'>Custom Nodes Required</span>
    if (status === 'update-available') return <span tw='text-yellow-500'>Update Available</span>
    if (status === 'unknown') return <span tw='text-gray-500'>Unknown</span>
    if (status === 'error') return <span tw='text-red-500'>❌ Error (a)</span>
    return <span tw='text-red-500'>❌ Error (b)</span>
}
