import type { ImageL, ImageT } from 'src/models/Image'
import Lightbox, { Plugin } from 'yet-another-react-lightbox'

import { addToolbarButton } from 'yet-another-react-lightbox/core'
import Download from 'yet-another-react-lightbox/plugins/download'
import FullScreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Inline from 'yet-another-react-lightbox/plugins/inline'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/styles.css'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { makeAutoObservable } from 'mobx'

const CustomPlugin: Plugin = ({ augment }) => {
    augment(({ toolbar, ...restProps }) => ({
        toolbar: addToolbarButton(
            //
            toolbar,
            'my-button',
            // <Rate vertical max={5} defaultValue={0} />,
            <div>🟢</div>,
        ),
        ...restProps,
    }))
}

export class LightBoxState {
    constructor(
        //
        public getImgs: () => ImageL[],
        public opened: boolean = false,
    ) {
        makeAutoObservable(this)
    }
    get imgs() {
        return this.getImgs()
    }
    index = 0
    openGallery = (ix: number) => {
        this.opened = true
        this.index = ix
    }
    closeGallery = () => {
        this.opened = false
    }
}

export const LightBoxUI = observer(function LightBoxUI_(p: { lbs: LightBoxState; inline?: boolean }) {
    const lbs = p.lbs
    if (!lbs.opened) return null
    // {/* https://github.com/igordanchenko/yet-another-react-lightbox */}
    return (
        <Lightbox
            index={lbs.index}
            on={{
                view: ({ index }) => (lbs.index = index),
                exited: lbs.closeGallery,
            }}
            styles={{ container: { minHeight: '20rem' } }}
            zoom={{ scrollToZoom: true, maxZoomPixelRatio: 10 }}
            thumbnails={{
                width: 48,
                height: 48,
                position: 'start',
                vignette: false,
                showToggle: true,
                border: 0,
                borderRadius: 20,
                imageFit: 'cover',
            }}
            plugins={[
                //
                Zoom,
                Download,
                FullScreen,
                CustomPlugin,
                Thumbnails,
                ...(p.inline ? [Inline] : []),
            ]}
            slides={lbs.imgs.map((img) => ({
                //
                src: img.url,
                // src: img.data.comfyURL ?? img.data.localURL ?? '🔴',
            }))}
            open={true}
        />
    )
})
