import Lightbox from 'yet-another-react-lightbox'
import { observer } from 'mobx-react-lite'
import { Carousel } from 'rsuite'
import Inline from 'yet-another-react-lightbox/plugins/inline'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview } from '../core-types/MessageFromExtensionToWebview'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

export const FlowGeneratedImagesUI = observer(function FlowGeneratedImagesUI_(p: { msg: MessageFromExtensionToWebview }) {
    const st = useSt()
    const msg = p.msg
    if (msg.type !== 'images') return <>error</>
    if (msg.uris.length === 0) return <>no images</>
    if (st.showImageAs === 'list') {
        return (
            <div style={{ width: '100%', maxWidth: '900px', aspectRatio: '3 / 2' }}>
                <Lightbox
                    zoom={{ scrollToZoom: true, maxZoomPixelRatio: 10 }}
                    thumbnails={{ position: 'top' }}
                    plugins={[Inline, Zoom, Thumbnails]}
                    open={true}
                    slides={msg.uris.map((imgUri) => ({
                        src: imgUri,
                    }))}
                />
            </div>
        )
    }
    if (st.showImageAs === 'carousel')
        return (
            <Carousel>
                {msg.uris.map((imgUri) => (
                    <img style={{ objectFit: 'contain' }} src={imgUri} />
                ))}
            </Carousel>
        )
    return (
        <div style={{ textAlign: 'center', display: 'flex' }}>
            {msg.uris.map((imgUri) => (
                <div key={imgUri}>
                    <img style={{ margin: '.1rem 0' }} src={imgUri} />
                </div>
            ))}
        </div>
    )
})
