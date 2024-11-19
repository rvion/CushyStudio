import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { MessageInfoUI } from '../../csuite'
import { DebugHoveredRegionUI } from '../../csuite/debug/DebugHoveredRegionUI'
import { DebugInputHistoryUI } from '../../csuite/debug/DebugInputHistoryUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { CommandTableUI } from './CommandTableUI'

export const PanelShortcutsUI = observer(function PanelShortcutsUI_(p: NO_PROPS) {
   return (
      <div className='flex flex-col gap-2'>
         <PanelHeaderUI>
            <DebugHoveredRegionUI />
            <DebugInputHistoryUI />
         </PanelHeaderUI>
         {/* <SectionTitleUI //
            label='Shortcuts'
            className='block'
         /> */}
         <CommandTableUI />
         <MessageInfoUI
            markdown={`\
This is unfinished.

A great contribution would be to make those shortcuts editable.

Interesting files:
- ./src/app/shortcuts/shortcuts.ts
- ./src/app/shortcuts/shorcutKeys.ts
`}
         ></MessageInfoUI>
      </div>
   )
})
