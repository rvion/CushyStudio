import { observer } from 'mobx-react-lite'

import { InputBoolToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { DebugControlsUI } from '../../csuite/debug/DebugControlsUI'
import { Frame } from '../../csuite/frame/Frame'
// import { tooltipStuff } from '../../csuite/frame/tooltip'
import { DebugShortcutsFloatingUI } from './DebugShortcutsFloatingUI'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
    return (
        <Frame
            //
            border={0}
            base={cushy.theme.value.appbar ?? { contrast: -0.077 }}
            tw='flex items-center px-1 py-1'
        >
            <InputBoolToggleButtonUI
                tw='mr-2'
                tooltip='Show Command Visualizer'
                onValueChange={(next) => (cushy.showCommandHistory = next)}
                value={cushy.showCommandHistory}
                icon='mdiKeyboard'
                toggleGroup='footer-conf'
            />
            <DebugControlsUI />
            <div tw='flex-1' />
            {/* {tooltipStuff.deepest && <div>{tooltipStuff.deepest.text}</div>} */}
            {cushy.showCommandHistory && <DebugShortcutsFloatingUI />}
        </Frame>
    )
})
