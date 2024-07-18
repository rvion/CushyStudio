import { observer } from 'mobx-react-lite'

import { SpacerUI } from '../../csuite/components/SpacerUI'
import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { Panel } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { GalleryImageGridUI } from './GalleryImageGridUI'
import { GallerySearchControlsUI } from './GallerySearchControlsUI'

export const PanelGallery = new Panel({
    name: 'Gallery',
    widget: () => PanelGalleryUI,
    header: (p) => ({ title: 'Gallery' }),
    icon: 'mdiViewGallery',
    def: () => ({}),
    presets: {
        'Gallery 1': () => ({ uid: 1 }),
        'Gallery 2': () => ({ uid: 2 }),
        'Gallery 3': () => ({ uid: 3 }),
    },
})

export const PanelGalleryUI = observer(function PanelGalleryUI_(p: { uid?: number }) {
    const st = useSt()

    return (
        <div //
            className='flex flex-col h-full'
            style={{ background: st.galleryConf.value.galleryBgColor ?? undefined }}
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
    return <FormAsDropdownConfigUI title='Gallery Options' form={cushy.galleryConf} />
})
