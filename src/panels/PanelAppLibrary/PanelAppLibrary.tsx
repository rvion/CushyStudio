import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { Panel, type PanelHeader } from '../../router/Panel'
import { PanelAppLibraryUI } from './PanelAppLibraryUI'

export const PanelAppLibrary = new Panel({
   name: 'PanelAppLibrary',
   category: 'app',
   widget: (): React.FC<NO_PROPS> => PanelAppLibraryUI,
   header: (p): PanelHeader => ({ title: 'PanelAppLibrary' }),
   def: (): NO_PROPS => ({}),
   icon: 'mdiBookmarkBoxMultipleOutline',
})
