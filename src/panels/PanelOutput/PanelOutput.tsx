import { Panel, type PanelHeader } from '../../router/Panel'
import { type PanelOutputProps, PanelOutputUI } from './PanelOutputUI'

export const PanelStep = new Panel({
   name: 'Output',
   widget: (): React.FC<PanelOutputProps> => PanelOutputUI,
   header: (p): PanelHeader => ({ title: 'Output' }),
   def: (): PanelOutputProps => ({}),
   category: 'outputs',
   icon: 'mdiFolderPlay',
})
