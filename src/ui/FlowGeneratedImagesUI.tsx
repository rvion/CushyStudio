import * as I from '@rsuite/icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Button, IconButton, Panel, Rate, Slider } from 'rsuite'
import Lightbox, { Plugin } from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import FullScreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
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
    const uiSt = useLocalObservable(() => ({
        index: 0,
        opened: false,
        openGallery(ix: number) {
            this.opened = true
            this.index = ix
        },
        closeGallery(){ this.opened = false }, // prettier-ignore
    }))
    if (msg.type !== 'images') return <>error</>
    if (msg.images.length === 0) return <>no images</>
    const selectedImg = msg.images[uiSt.index]
    // if (st.showImageAs === 'list') {
    return (
        <Panel
            collapsible
            defaultExpanded
            shaded
            header={
                <div>
                    <I.Image /> Images
                </div>
            }
        >
            {/* https://github.com/igordanchenko/yet-another-react-lightbox */}
            {uiSt.opened ? (
                <Lightbox
                    index={uiSt.index}
                    on={{
                        view: ({ index }) => (uiSt.index = index),
                        exited: uiSt.closeGallery,
                    }}
                    styles={{ container: { minHeight: '20rem' } }}
                    zoom={{ scrollToZoom: true, maxZoomPixelRatio: 10 }}
                    plugins={[Zoom, Download, FullScreen, RatePlugin, Thumbnails]}
                    open={true}
                    slides={msg.images.map((img) => ({ src: img.comfyURL }))}
                />
            ) : null}
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
                </div>

                <div className='flex row items-center gap-2'>
                    <div className='propName'>local path</div>
                    <div className='propValue'>{selectedImg?.localRelativeFilePath}</div>
                </div>
                {/* <pre>{JSON.stringify(msg.images[0], null, 4)}</pre> */}
            </div>
            <Panel></Panel>
            <div className='row gap-2 flex-wrap'>
                <Slider
                    vertical
                    style={{ height: '10rem' }}
                    className='relative px-3'
                    onChange={(next) => (st.gallerySize = next)}
                    value={st.gallerySize}
                    max={1000}
                    min={32}
                    step={1}
                />
                {msg.images.map((img, ix) => (
                    // <div className='border' key={img.uid}>
                    // {/* <Whisper
                    //     placement='auto'
                    //     speaker={
                    //         <Popover>
                    //             <img src={img.comfyURL} />
                    //         </Popover>
                    //     }
                    // > */}
                    <div className='flex flex-col'>
                        <div>
                            <IconButton
                                size='xs'
                                startIcon={<I.FolderFill />}
                                onClick={() => {
                                    st.sendMessageToExtension({
                                        type: 'open-external',
                                        uriString: `file://${selectedImg.localAbsoluteFilePath}`,
                                    })
                                }}
                            >
                                {/* Open */}
                            </IconButton>
                        </div>
                        <img style={{ height: st.gallerySize }} src={img.comfyURL} onClick={() => uiSt.openGallery(ix)} />

                        <Rate size='xs' vertical max={5} defaultValue={0} />
                    </div>
                    //     {/* </Whisper> */}
                    // {/* </div> */}
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
