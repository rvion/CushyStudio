import { observer } from 'mobx-react-lite'

import { ToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { Frame } from '../../csuite/frame/Frame'
import { DebugShortcutsFloatingUI } from './DebugShortcutsFloatingUI'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
   return (
      <Frame
         //
         border={0}
         base={cushy.theme.value.appbar ?? { contrast: -0.077 }}
         tw='line-clamp-1 flex items-center truncate px-1 py-1'
      >
         <ToggleButtonUI
            tw='mr-2'
            tooltip='Show Command Visualizer'
            onValueChange={(next) => (cushy.showCommandHistory = next)}
            value={cushy.showCommandHistory}
            icon='mdiKeyboard'
            toggleGroup='footer-conf'
         />

         <div tw='flex-1' />
         {/* {tooltipStuff.deepest && <div>{tooltipStuff.deepest.text}</div>} */}
         {cushy.showCommandHistory && <DebugShortcutsFloatingUI />}
      </Frame>
   )
})
