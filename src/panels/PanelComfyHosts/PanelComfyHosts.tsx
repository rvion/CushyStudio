import { Panel, type PanelHeader } from '../../router/Panel'
import { type PanelComfyHostProps, PanelComfyHostsUI } from './PanelComfyHostsUI'

export const PanelComfyHosts = new Panel({
   name: 'Hosts',
   category: 'ComfyUI',
   widget: (): React.FC<PanelComfyHostProps> => PanelComfyHostsUI,
   header: (): PanelHeader => ({ title: 'Hosts' }),
   def: (): PanelComfyHostProps => ({}),
   icon: 'mdiDesktopTower',
})
