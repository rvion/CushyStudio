import { Panel, type PanelHeader, type PanelPreset } from '../../router/Panel'
import { type PanelGalleryProps, PanelGalleryUI } from './PanelGalleryUI'

export const PanelGallery = new Panel({
    name: 'Gallery',
    category: 'outputs',
    widget: (): React.FC<PanelGalleryProps> => PanelGalleryUI,
    header: (p: PanelGalleryProps): PanelHeader => ({ title: 'Gallery' }),
    icon: 'mdiViewGallery',
    def: (): PanelGalleryProps => ({}),
    presets: {
        'Gallery 1': (): PanelPreset<PanelGalleryProps> => ({ props: { uid: 1 } }),
        'Gallery 2': (): PanelPreset<PanelGalleryProps> => ({ props: { uid: 2 } }),
        'Gallery 3': (): PanelPreset<PanelGalleryProps> => ({ props: { uid: 3 } }),
    },
})
