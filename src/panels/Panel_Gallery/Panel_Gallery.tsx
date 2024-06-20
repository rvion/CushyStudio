import { observer } from 'mobx-react-lite'

import { SpacerUI } from '../../csuite/fields/spacer/SpacerUI'
import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { useSt } from '../../state/stateContext'
import { GalleryImageGridUI } from './GalleryImageGridUI'
import { GallerySearchControlsUI } from './GallerySearchControlsUI'

export const Panel_Gallery = observer(function VerticalGalleryUI_(p: { uid?: number }) {
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
