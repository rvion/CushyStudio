import type { ImageInfos } from '../core/GeneratedImageSummary'

import * as I from '@rsuite/icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Button, IconButton, Panel, Popover, Rate, Slider, Whisper } from 'rsuite'
import { useSt } from '../front/stContext'
import { MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import { useMemo } from 'react'
import { LightBoxState, LightBoxUI } from './LightBox'

export const ImageTooltipUI = observer(function ImageTooltipUI_(p: { selectedImage: ImageInfos }) {
    const selectedImg = p.selectedImage
    return (
        <div>
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
                    <div className='propValue'>{selectedImg?.localAbsolutePath}</div>
                </div>
                {/* <pre>{JSON.stringify(msg.images[0], null, 4)}</pre> */}
            </div>
        </div>
    )
})
export const FlowGeneratedImagesUI = observer(function FlowGeneratedImagesUI_(p: { msg: MessageFromExtensionToWebview }) {
    const st = useSt()
    const msg = p.msg

    // 🔴
    if (msg.type !== 'images') return <>error</>
    if (msg.images.length === 0) return <>no images</>
    const uiSt = useMemo(() => new LightBoxState(() => msg.images), [msg.images])

    return (
        <Panel
            // collapsible
            // defaultExpanded
            shaded
            header={
                <div className='flex items-end'>
                    <I.Image /> Images
                    <div>
                        <Slider
                            className='relative px-3'
                            onChange={(next) => (st.gallerySize = next)}
                            value={st.gallerySize}
                            style={{ width: '200px' }}
                            max={1000}
                            min={32}
                            step={1}
                        />
                    </div>
                </div>
            }
        >
            {/* https://github.com/igordanchenko/yet-another-react-lightbox */}
            <LightBoxUI lbs={uiSt} />
            <div className='row gap-2 flex-wrap'>
                {msg.images.map((img, ix) => (
                    <Whisper
                        placement='auto'
                        speaker={
                            <Popover>
                                <ImageTooltipUI selectedImage={msg.images[ix]} />
                            </Popover>
                        }
                    >
                        <div className='flex'>
                            <img
                                style={{ height: st.gallerySize }}
                                src={img.localURL ?? img.comfyURL}
                                onClick={() => uiSt.openGallery(ix)}
                            />
                            <div className='flex flex-col'>
                                <Rate size='xs' vertical max={5} defaultValue={0} />
                                <Button
                                    size='xs'
                                    startIcon={<I.FolderFill />}
                                    onClick={() => {
                                        st.sendMessageToExtension({
                                            type: 'open-external',
                                            uriString: `file://${img.localAbsolutePath}`,
                                        })
                                    }}
                                >
                                    Open
                                </Button>
                                <Button>script 1</Button>
                                <Button onClick={() => (st.currentAction = { type: 'paint', img })}>Paint</Button>
                                <Button>script 3</Button>
                            </div>
                        </div>
                    </Whisper>
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
