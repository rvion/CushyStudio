import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { DebugControlsUI } from '../../csuite/debug/DebugControlsUI'
import { MessageInfoUI } from '../../csuite/messages/MessageInfoUI'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { Panel, type PanelHeader } from '../../router/Panel'
import { SectionTitleUI } from '../../widgets/workspace/SectionTitle'
import { CommandTableUI } from './CommandTableUI'

export const PanelShortcuts = new Panel({
    name: 'Shortcuts',
    category: 'settings',
    widget: (): React.FC<NO_PROPS> => PanelShortcutsUI,
    header: (p: NO_PROPS): PanelHeader => ({ title: 'Shortcuts' }),
    def: (): NO_PROPS => ({}),
    icon: 'mdiKeyboardOutline',
})

export const PanelShortcutsUI = observer(function PanelShortcutsUI_(p: NO_PROPS) {
    return (
        <div className='flex flex-col gap-2'>
            <PanelHeaderUI>
                <DebugControlsUI />
            </PanelHeaderUI>
            <SectionTitleUI label='Shortcuts' className='block' />
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
