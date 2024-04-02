import { observer } from 'mobx-react-lite'

import { FormUI } from '../../controls/FormUI'
import { SpacerUI } from '../../controls/widgets/spacer/SpacerUI'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { useSt } from '../../state/stateContext'
import { PanelHeaderUI } from '../PanelHeader'
import { GalleryImageGridUI } from './GalleryImageGridUI'
import { GallerySearchControlsUI } from './GallerySearchControlsUI'
import { STATE } from '../../state/state'

export const Panel_Gallery = observer(function VerticalGalleryUI_(p: { uid?: string }) {
    const st = useSt()

    return (
        <div //
            className={`panel-gallery-${p.uid} flex flex-col bg-base-100 h-full`}
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

export function PanelGalery_RegisterKeymaps(st: STATE) {
    st.keymaps.new('Gallery', {
        // Is inside region, should be a utility function somewhere. Somewhere re-usable
        poll: (ctx: STATE, ev: Event): boolean => {
            if (ctx.hoveredRegion?.type == 'gallery') {
                return true
            }

            return false
        },
        items: [{ event: { type: 'keydown', value: 's', alt: true }, operator: 'TEST_OT_test', properties: {} }],
    })
}
