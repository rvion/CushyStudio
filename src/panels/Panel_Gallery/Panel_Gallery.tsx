import { observer } from 'mobx-react-lite'

import { FormUI } from '../../controls/FormUI'
import { SpacerUI } from '../../controls/widgets/spacer/SpacerUI'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { useSt } from '../../state/stateContext'
import { PanelHeaderUI } from '../PanelHeader'
import { GalleryImageGridUI } from './GalleryImageGridUI'
import { GallerySearchControlsUI } from './GallerySearchControlsUI'

export const Panel_Gallery = observer(function VerticalGalleryUI_(p: { uid?: number }) {
    const st = useSt()

    return (
        <div //
            className='flex flex-col bg-base-100 h-full'
            style={{ background: st.galleryConf.value.galleryBgColor }}
        >
            <PanelHeaderUI>
                <GallerySearchControlsUI />
                <SpacerUI />
                <GalleryPreferences />
            </PanelHeaderUI>
            <GalleryImageGridUI />
        </div>
    )
})

export const GalleryPreferences = observer(function FooUI_(p: {}) {
    return (
        <RevealUI
            tw='WIDGET-FIELD'
            title='Gallery Options'
            content={() => (
                <div style={{ width: '500px' }} tw='flex-shrink-0'>
                    <FormUI form={cushy.galleryConf} />
                </div>
            )}
        >
            <div tw='flex px-1 cursor-default bg-base-200 rounded w-full h-full items-center justify-center hover:brightness-125 border border-base-100'>
                <span className='material-symbols-outlined'>settings</span>
                <span className='material-symbols-outlined'>expand_more</span>
            </div>
        </RevealUI>
    )
})
