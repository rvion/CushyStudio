import type { PanelName } from './PANELS'
import type * as FL from 'flexlayout-react'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { ErrorBoundaryUI } from '../csuite/errors/ErrorBoundaryUI'
import { Frame } from '../csuite/frame/Frame'
import { LegacyMessageUI } from '../csuite/inputs/LegacyMessageUI'
import { useMemoAction } from '../csuite/utils/useMemoAction'
import { panels } from './PANELS'
import { PanelState } from './PanelState'
import { PanelStateByNode } from './PanelStateByNode'
import { panelContext } from './usePanel'

/** internal component; do not use yourself */
export const PanelContainerUI = observer(function PanelContainer(p: {
   //
   flexLayoutTabNode: FL.TabNode
   panelName: PanelName
   panelProps: any
}) {
   const { panelName, panelProps, flexLayoutTabNode } = p
   const panelDef = (panels as any)[panelName]
   const panelURI = p.flexLayoutTabNode.getId()
   const panelState = useMemoAction(() => {
      const ps = new PanelState(flexLayoutTabNode, panelURI, panelDef)
      PanelStateByNode.set(panelURI, ps)
      return ps
   }, [flexLayoutTabNode, panelURI])

   // -----------------------
   // Those 3 lines allow to unmount the component when it's not visible
   const [visible, setVisible] = useState(() => flexLayoutTabNode?.isVisible() ?? true)
   p.flexLayoutTabNode?.setEventListener('visibility', (e: { visible: boolean }) => setVisible(e.visible))
   if (!visible) return null
   // -----------------------

   // 3. get panel definition
   if (panelDef == null)
      return (
         <LegacyMessageUI type='error' showIcon>
            no panel definition for {panelName}
         </LegacyMessageUI>
      )

   const blacklist: PanelName[] = [
      //
      // 'Welcome',
      // 'PanelAppLibrary',
      // 'Output',
      // 'Gallery',
      // 'Draft',
   ]

   if (blacklist.includes(panelName)) return null
   const Component = panelDef.widget
   return (
      <ErrorBoundaryUI>
         <panelContext.Provider value={panelState}>
            <Frame
               col
               tw='h-full w-full flex-1 overflow-auto'
               className={`Region-${panelName}`}
               data-panel-id={panelURI}
               id={panelURI}
               // HACK?(bird_d): Needed to make panel headers lighter
               onMouseEnter={(e) => e.currentTarget.classList.add('Hovered-Region')}
               onMouseLeave={(e) => e.currentTarget.classList.remove('Hovered-Region')}
               onFocus={(e) => e.currentTarget.classList.add('Hovered-Region')}
               onBlur={(e) => e.currentTarget.classList.remove('Hovered-Region')}
            >
               <Component {...panelProps} className='size-full border-none' />
            </Frame>
         </panelContext.Provider>
      </ErrorBoundaryUI>
   )
})
