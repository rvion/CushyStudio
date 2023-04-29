import { observer } from 'mobx-react-lite'
import { Carousel } from 'rsuite'
import { MessageFromExtensionToWebview } from '../core-types/MessageFromExtensionToWebview'
import { useSt } from '../core-front/stContext'

export const FlowGeneratedImagesUI = observer(function FlowGeneratedImagesUI_(p: { msg: MessageFromExtensionToWebview }) {
    const st = useSt()
    const msg = p.msg
    if (msg.type !== 'images') return <>error</>
    if (msg.uris.length === 0) return <>no images</>
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
