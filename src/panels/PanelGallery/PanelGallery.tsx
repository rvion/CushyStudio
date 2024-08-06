import { observer } from 'mobx-react-lite'

import { SpacerUI } from '../../csuite/components/SpacerUI'
import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useGalleryConf } from './galleryConf'
import { GalleryImageGridUI } from './GalleryImageGridUI'
import { GallerySearchControlsUI } from './GallerySearchControlsUI'

export const PanelGallery = new Panel({
    name: 'Gallery',
    category: 'outputs',
    widget: (): React.FC<PanelGalleryProps> => PanelGalleryUI,
    header: (p: PanelGalleryProps): PanelHeader => ({ title: 'Gallery' }),
    icon: 'mdiViewGallery',
    def: (): PanelGalleryProps => ({}),
    presets: {
        'Gallery 1': (): PanelGalleryProps => ({ uid: 1 }),
        'Gallery 2': (): PanelGalleryProps => ({ uid: 2 }),
        'Gallery 3': (): PanelGalleryProps => ({ uid: 3 }),
    },
})

export type PanelGalleryProps = {
    uid?: number
}

export const PanelGalleryUI = observer(function PanelGalleryUI_(p: PanelGalleryProps) {
    const conf = useGalleryConf()
    return (
        <div //
            className='flex flex-col h-full'
            style={{ background: conf.value.galleryBgColor ?? undefined }}
        >
            <PanelHeaderUI>
                <GalleryPreferencesUI />
                <GallerySearchControlsUI />
                <SpacerUI />
            </PanelHeaderUI>
            <GalleryImageGridUI />
        </div>
    )
})

export const GalleryPreferencesUI = observer(function GalleryPreferencesUI_(p: {}) {
    const conf = useGalleryConf()
    return (
        <FormAsDropdownConfigUI //
            title='Gallery Options'
            form={conf}
        />
    )
})
