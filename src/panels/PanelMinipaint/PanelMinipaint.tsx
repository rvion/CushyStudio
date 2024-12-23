// https://github.com/devforth/painterro

import { Panel, type PanelHeader } from '../../router/Panel'
import { type PanelMinipaintProps, PanelMinipaintUI } from './PanelMinipaintUI'

export const PanelMinipaint = new Panel({
   name: 'Paint',
   widget: (): React.FC<PanelMinipaintProps> => PanelMinipaintUI,
   header: (p): PanelHeader => ({ title: '🎨 Paint' }),
   def: (): PanelMinipaintProps => ({}),
   icon: 'mdiPencil',
   category: 'tools',
})
