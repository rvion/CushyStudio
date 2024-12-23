import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { Panel, type PanelHeader } from '../../router/Panel'
import { PanelWelcomeUI } from './PanelWelcomeUI'

export const PanelWelcome = new Panel({
   name: 'Welcome',
   widget: (): React.FC<NO_PROPS> => PanelWelcomeUI,
   header: (p): PanelHeader => ({ title: 'Welcome' }),
   def: (): NO_PROPS => ({}),
   icon: 'mdiHome',
   category: 'help',
})
