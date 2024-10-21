import { Panel, type PanelHeader } from '../../router/Panel'
import { type PanelCanvasProps, PanelCanvasUI } from './PanelCanvasUI'

export const PanelCanvas = new Panel({
    name: 'Canvas',
    category: 'tools',
    widget: (): React.FC<PanelCanvasProps> => PanelCanvasUI,
    header: (p): PanelHeader => ({ title: 'Canvas' }),
    def: (): PanelCanvasProps => ({}),
    icon: 'mdiDraw',
})
