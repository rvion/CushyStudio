import type { PluginInfo } from 'src/manager/custom-node-list/custom-node-list-types'

import { observer } from 'mobx-react-lite'
import { useAsyncAction } from 'src/importers/usePromise'
import { useSt } from 'src/state/stateContext'
import { renderStatus } from './renderStatus'

export const Button_InstallCustomNodeUI = observer(function Button_InstallCustomNodeUI_(p: {
    optional: boolean
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
                <div style={{ lineHeight: '1rem' }}>
                    <span className='font-bold text-primary'>NODES: {plugin.title}</span>
                </div>
                {/* {isInstalled ? <span tw='text-green-500'>Installed</span> : <span tw='text-red-500'>Custom Nodes Required</span>} */}
                <div className='flex-1'></div>
                {renderStatus(pluginStatus, p.optional)}
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
                <summary>more...</summary>
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
