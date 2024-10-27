import type { PluginInfo } from '../../manager/custom-node-list/custom-node-list-types'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { useAsyncAction } from '../../importers/usePromise'
import { useSt } from '../../state/stateContext'
import { renderStatus } from './renderStatus'

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
      <Frame base tw={[isInstalled ? 'bg-success-1' : null, 'flex-col rounded p-2']}>
         <div tw='flex pb-2' /* Contains everything but description */>
            <div tw='flex-1 flex-col' /* Node info container */>
               <div tw='flex items-center gap-1 p-0.5' /* Title container */>
                  <span tw='whitespace-nowrap text-xl font-bold text-blue-500'>
                     <span className='material-symbols-outlined'>account_tree</span>
                  </span>
                  <div tw='flex-col self-start' /* Title and Author */>
                     <div style={{ lineHeight: '1rem' }}>
                        <span className='text-primary text-base font-bold'>NODES: {plugin.title}</span>
                     </div>
                     <div tw='pl-0 text-xs opacity-75'>{plugin.author}</div>
                  </div>
                  {/* {isInstalled ? <span tw='text-green-500'>Installed</span> : <span tw='text-red-500'>Custom Nodes Required</span>} */}
                  <div className='flex-1'></div>
                  {renderStatus(pluginStatus, p.optional, 'text-xs pr-2 self-start')}
               </div>
            </div>
            <div tw='flex flex-col'>
               {!isInstalled && (
                  <Button
                     icon={isInstalled ? 'mdiCheck' : 'mdiDownload'}
                     loading={action.isRunning}
                     onClick={() => action.start()}
                  >
                     {action.isRunning ? <div tw='loading loading-spinner' /> : null}
                     {isInstalled ? '✅' : null}
                  </Button>
               )}
            </div>
         </div>

         <div // Description Container
            tw={[
               'cursor-default rounded-b px-1 py-0.5',
               isExpanded ? '' : 'truncate',
               'hover:brightness-125',
            ]}
            onClick={(ev) => {
               setIsExpanded(!isExpanded)
            }}
         >
            <span tw='text-sm italic opacity-75'>
               {plugin.description}
               {/* TODO: show install method by icon? */}
               {/* (via {plugin.install_type}) */}
            </span>
         </div>
         {/* {showDescription && <span tw='italic text-sm opacity-75'>why ? author: {reason}</span>} */}
      </Frame>
   )
})
