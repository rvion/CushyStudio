import type { PluginInfo } from 'src/manager/custom-node-list/custom-node-list-types'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { renderStatus } from './renderStatus'
import { useAsyncAction } from 'src/importers/usePromise'
import { useSt } from 'src/state/stateContext'

export const Button_InstallCustomNodeUI = observer(function Button_InstallCustomNodeUI_(p: {
    optional: boolean
    plugin: PluginInfo
}) {
    const st = useSt()
    const { plugin } = p
    const host = st.mainHost
    const pluginStatus = host.manager.getPluginStatus(p.plugin.title)
    const isInstalled = pluginStatus === 'installed'
    const action = useAsyncAction(() => host.manager.installPlugin(plugin), [])
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    return (
        <div tw={[isInstalled ? 'bg-success-1' : null, 'flex-col virtualBorder p-2 bg-base-100 rounded']}>
            <div tw='flex pb-2' /* Contains everything but description */>
                <div tw='flex-1 flex-col' /* Node info container */>
                    <div tw='flex items-center gap-1 p-0.5' /* Title container */>
                        <span tw='font-bold whitespace-nowrap text-3xl text-blue-500'>
                            <span className='material-symbols-outlined'>account_tree</span>
                        </span>
                        <div tw='flex-col self-start' /* Title and Author */>
                            <div style={{ lineHeight: '1rem' }}>
                                <span className='font-bold text-primary text-base'>NODES: {plugin.title}</span>
                            </div>
                            <div tw='text-xs opacity-75 pl-0'>{plugin.author}</div>
                        </div>
                        {/* {isInstalled ? <span tw='text-green-500'>Installed</span> : <span tw='text-red-500'>Custom Nodes Required</span>} */}
                        <div className='flex-1'></div>
                        {renderStatus(pluginStatus, p.optional, 'text-xs pr-2 self-start')}
                    </div>
                    {/* <div tw='flex-col flex-1 p-2'> */}
                    {/* <details>
                        <summary>more...</summary>
                        <div tw='flex gap-1'>
                            <div tw='font-bold'>Author:</div> */}

                    {/* <div>{getCustomNodeRegistry()}</div> */}
                    {/* <pre>{JSON.stringify(host.manager.knownNodeList, null, 3)}</pre> */}
                    {/* </div>
                    </details> */}
                    {/* </div> */}
                </div>

                <div tw='flex-col flex'>
                    {!isInstalled && (
                        <div
                            tw={[
                                'rounded btn bg-primaryborder border-base-300 w-12 h-12',
                                action.isRunning ? 'btn-disabled' : null,
                            ]}
                            onClick={() => action.start()}
                        >
                            {action.isRunning ? <div tw='loading loading-spinner' /> : null}
                            {isInstalled ? '✅' : null}
                            <span className='material-symbols-outlined'>{isInstalled ? 'download_done' : 'cloud_download'}</span>
                        </div>
                    )}
                </div>
            </div>

            <div // Description Container
                tw={['rounded-b bg-base-300 py-0.5 px-1 cursor-default', isExpanded ? '' : 'truncate', 'hover:brightness-125']}
                onClick={(ev) => {
                    setIsExpanded(!isExpanded)
                }}
            >
                <span tw='italic text-sm opacity-75'>
                    {plugin.description}
                    {/* TODO: show install method by icon? */}
                    {/* (via {plugin.install_type}) */}
                </span>
            </div>
            {/* {showDescription && <span tw='italic text-sm opacity-75'>why ? author: {reason}</span>} */}
        </div>
    )
})
