import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { Panel, type PanelHeader } from '../../router/Panel'
import { PanelShortcutsUI } from './PanelShortcutsUI'

export const PanelShortcuts = new Panel({
   name: 'Shortcuts',
   category: 'settings',
   widget: (): React.FC<NO_PROPS> => PanelShortcutsUI,
   header: (p: NO_PROPS): PanelHeader => ({ title: 'Shortcuts' }),
   def: (): NO_PROPS => ({}),
   icon: 'mdiKeyboardOutline',
})
