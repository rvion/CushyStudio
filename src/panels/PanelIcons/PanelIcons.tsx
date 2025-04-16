import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { Panel, type PanelHeader } from '../../router/Panel'
import { PanelIconUI } from './PanelIconUI'

export const PanelIcon = new Panel({
   name: 'Icons',
   category: 'developper',
   widget: (): React.FC<NO_PROPS> => PanelIconUI,
   header: (_: NO_PROPS): PanelHeader => ({ title: 'Icons', icon: IKONS.mdiImageSyncOutline }),
   def: (): NO_PROPS => ({}),
   icon: IKONS.mdiImageSyncOutline,
})
