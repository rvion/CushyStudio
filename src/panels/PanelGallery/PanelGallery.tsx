import type { MediaImageL } from '../../models/MediaImage'

import { observer } from 'mobx-react-lite'

import { SpacerUI } from '../../csuite/components/SpacerUI'
import { UI } from '../../csuite/components/UI'
import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
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
    className?: string
    /** when not specified, it will just open the default image menu */
    onClick?: (img: MediaImageL) => void
}

export const PanelGalleryUI = observer(function PanelGalleryUI_(p: PanelGalleryProps) {
    const conf = useGalleryConf()
    return (
        <UI.Panel //
            // className='flex flex-col h-full'
            className={p.className}
            style={{ background: conf.value.galleryBgColor ?? undefined }}
        >
            <UI.Panel.Header>
                <GalleryPreferencesUI />
                <GallerySearchControlsUI />
                <SpacerUI />
            </UI.Panel.Header>
            <GalleryImageGridUI onClick={p.onClick} />
        </UI.Panel>
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
