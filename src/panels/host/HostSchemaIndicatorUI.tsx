import type { HostL } from '../../models/Host'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { Ikon } from '../../csuite/icons/iconHelpers'
import { LegacyMessageUI } from '../../csuite/inputs/LegacyMessageUI'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { QuickHostActionsUI } from '../../manager/REQUIREMENTS/QuickHostActionsUI'

export const HostSchemaIndicatorUI = observer(function HostSchemaIndicatorUI_(p: {
   //
   showIcon?: boolean
   showSize?: boolean
   host: HostL
}) {
   const host = p.host
   const size = host.schema?.size ?? 0
   const sizeTxt = p.showSize ? <div tw='text-xs text-opacity-50'>({size} nodes)</div> : null
   return (
      <RevealUI
         showDelay={0}
         content={() => (
            <div tw='menu'>
               <div tw='text-xs text-opacity-50'>({size} nodes)</div>
               {p.host.ws?.isOpen ? null : (
                  <LegacyMessageUI showIcon type='warning'>
                     <div>Is your ComfyUI server running? </div>
                     <div>You config file says it should be accessible at</div>
                     <div>{host.getServerHostHTTP()}</div>
                     <div>{host.getWSUrl()}</div>
                  </LegacyMessageUI>
               )}
               <pre>{host.schemaRetrievalLogs.join('\n')}</pre>
               <QuickHostActionsUI host={host} />
            </div>
         )}
      >
         <div tw='flex'>
            {host.schema == null ? '🔴' : null}

            {/* LAST UPDATE */}
            {host.schemaUpdateResult ? (
               host.schemaUpdateResult.type === 'error' ? (
                  <Button subtle className='cursor-help'>
                     <span className='text-error'>history</span>
                  </Button>
               ) : p.showIcon ? (
                  <Button
                     className='btn-ghost cursor-help'
                     icon={p.showIcon ? 'mdiCheckCircle' : undefined}
                  />
               ) : null
            ) : null}

            {/* SIZE */}
            {size === 0 ? (
               <Button loading={host.isUpdatingSchema} icon='mdiAlertCircle' look='error'>
                  empty schema
               </Button>
            ) : (
               <Button className='btn-ghost cursor-help'>
                  {p.showIcon && <Ikon.mdiCheckCircle tw='text-green-400' />}
                  {host.isUpdatingSchema && <div tw='loading loading-spinner loading-xs' />}
                  <span className='text-success'>Schema</span>
                  {sizeTxt}
               </Button>
            )}
         </div>
      </RevealUI>
   )
})
