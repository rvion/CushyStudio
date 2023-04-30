import { observer } from 'mobx-react-lite'
import { Carousel, Panel, Rate } from 'rsuite'
import Lightbox, { Plugin } from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import FullScreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Inline from 'yet-another-react-lightbox/plugins/inline'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview } from '../core-types/MessageFromExtensionToWebview'

import { addToolbarButton } from 'yet-another-react-lightbox/core'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/styles.css'

const RatePlugin: Plugin = ({ augment }) => {
    augment(({ toolbar, ...restProps }) => ({
        toolbar: addToolbarButton(
            //
            toolbar,
            'my-button',
            <Rate vertical max={5} defaultValue={0} />,
        ),
        ...restProps,
    }))
}

export const FlowGeneratedImagesUI = observer(function FlowGeneratedImagesUI_(p: { msg: MessageFromExtensionToWebview }) {
    const st = useSt()
    const msg = p.msg
    if (msg.type !== 'images') return <>error</>
    if (msg.images.length === 0) return <>no images</>
    // if (st.showImageAs === 'list') {
    return (
        <Panel
            onScrollCapture={(e: any) => {
                e.stopPropagation()
                e.preventDefault()
            }}
            onScroll={(e: any) => {
                e.stopPropagation()
                e.preventDefault()
            }}
            shaded
            style={{ width: '100%' }}
        >
            {/* https://github.com/igordanchenko/yet-another-react-lightbox */}
            <Lightbox
                render={{}}
                styles={{ container: { minHeight: '20rem' } }}
                zoom={{ scrollToZoom: true, maxZoomPixelRatio: 10 }}
                // thumbnails={{ position: 'start', vignette: false, showToggle: true }}
                plugins={[
                    //
                    Inline,
                    Zoom,
                    Download,
                    FullScreen,
                    RatePlugin,
                    // Thumbnails,
                ]}
                open={true}
                slides={msg.images.map((img) => ({ src: img.comfyURL }))}
            />
            <div>
                <pre>{JSON.stringify(msg.images[0], null, 4)}</pre>
            </div>
            <div className='row gap-2'>
                {msg.images.map((img) => (
                    <div className='border' key={img.uid}>
                        <img style={{ width: '3rem' }} src={img.comfyURL} />
                    </div>
                ))}
            </div>
        </Panel>
    )
    // }
    // if (st.showImageAs === 'carousel')
    //     return (
    //         <Carousel>
    //             {msg.uris.map((imgUri) => (
    //                 <img style={{ objectFit: 'contain' }} src={imgUri} />
    //             ))}
    //         </Carousel>
    //     )
    // return (
    //     <div style={{ textAlign: 'center', display: 'flex' }}>
    //         {msg.uris.map((imgUri) => (
    //             <div key={imgUri}>
    //                 <img style={{ margin: '.1rem 0' }} src={imgUri} />
    //             </div>
    //         ))}
    //     </div>
    // )
})
