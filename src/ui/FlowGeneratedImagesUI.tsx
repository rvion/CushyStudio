import { observer, useLocalObservable } from 'mobx-react-lite'
import { Button, IconButton, Panel, Rate } from 'rsuite'
import * as I from '@rsuite/icons'
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
    const uiSt = useLocalObservable(() => ({ index: 0 }))
    if (msg.type !== 'images') return <>error</>
    if (msg.images.length === 0) return <>no images</>
    const selectedImg = msg.images[uiSt.index]
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
                index={uiSt.index}
                on={{ view: ({ index }) => (uiSt.index = index) }}
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
                <div className='prop row'>
                    <div className='propName'>uid</div>
                    <div className='propValue'>{selectedImg?.uid}</div>
                </div>
                <div className='prop row'>
                    <div className='propName'>comfy path</div>
                    <div className='propValue'>{selectedImg?.comfyRelativePath}</div>
                </div>
                <div className='prop row'>
                    <div className='propName'>comfy URL</div>
                    <div className='propValue'>
                        <a href='{selectedImg?.comfyURL}'>{selectedImg?.comfyURL}</a>
                    </div>
                </div>{' '}
                <div className='flex row items-center gap-2'>
                    <div className='propName'>local path</div>
                    <div className='propValue'>{selectedImg?.localRelativeFilePath}</div>
                    <Button
                        size='sm'
                        appearance='ghost'
                        startIcon={<I.FolderFill />}
                        onClick={() => {
                            st.sendMessageToExtension({
                                type: 'open-external',
                                // uriString: `file://${selectedImg?.localRelativeFilePath}`,
                                uriString:
                                    'file:///Users/loco/csdemo/.cushy/cache/Run-20230430105719/0YRw3SNOVz_Z-dKyHMCvD_prompt-1_1.png',
                            })
                        }}
                    >
                        Open
                    </Button>
                </div>
                {/* <pre>{JSON.stringify(msg.images[0], null, 4)}</pre> */}
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
