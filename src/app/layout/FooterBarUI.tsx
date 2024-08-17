import { observer, useLocalObservable } from 'mobx-react-lite'

import { InputBoolToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { DebugControlsUI } from '../../csuite/debug/DebugControlsUI'
import { Frame } from '../../csuite/frame/Frame'
import { tooltipStuff } from '../../csuite/frame/tooltip'
import { DebugShortcutsFloatingUI } from './DebugShortcutsFloatingUI'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
    return (
        <Frame
            //
            base={cushy.theme.value.appbar ?? { contrast: 0.3 }}
            tw='flex items-center px-1 h-input'
        >
            <InputBoolToggleButtonUI
                tooltip='Show Command Visualizer'
                onValueChange={(next) => (cushy.showCommandHistory = next)}
                value={cushy.showCommandHistory}
                icon='mdiKeyboard'
            />
            <DebugControlsUI />
            <div tw='flex-1' />
            {tooltipStuff.deepest && <div>{tooltipStuff.deepest.text}</div>}
            {cushy.showCommandHistory && <DebugShortcutsFloatingUI />}
        </Frame>
    )
})
