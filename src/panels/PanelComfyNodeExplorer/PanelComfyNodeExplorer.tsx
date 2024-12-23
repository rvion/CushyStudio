import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { Panel, type PanelHeader } from '../../router/Panel'
import { PanelComfyNodeExplorerUI } from './PanelComfyNodeExplorerUI'

export const PanelComfyNodeExplorer = new Panel({
   name: 'ComfyUI Node Explorer',
   category: 'ComfyUI',
   widget: (): React.FC<NO_PROPS> => PanelComfyNodeExplorerUI,
   header: (p): PanelHeader => ({ title: 'ComfyUI Node Explorer' }),
   def: (): NO_PROPS => ({}),
   icon: 'mdiAccessPoint',
})
