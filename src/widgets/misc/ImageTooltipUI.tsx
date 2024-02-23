import type { MediaImageL } from 'src/models/MediaImage'

import { observer } from 'mobx-react-lite'

import { JsonViewUI } from '../workspace/JsonViewUI'

export const ImageTooltipUI = observer(function ImageTooltipUI_(p: { selectedImage: MediaImageL }) {
    return (
        <div>
            <JsonViewUI value={p.selectedImage.data} />
        </div>
    )
})

// export const FlowGeneratedImagesUI = observer(function FlowGeneratedImagesUI_(p: { msg: MessageFromExtensionToWebview }) {
//     const st = useSt()
//     const msg = p.msg

//     // 🔴
//     if (msg.type !== 'images') return <>error</>
//     if (msg.images.length === 0) return <>no images</>
//     const uiSt = useMemo(() => new LightBoxState(() => msg.images), [msg.images])

//     return (
//         <Panel
//             // collapsible
//             // defaultExpanded
//             shaded
//             header={
//                 <div className='flex items-end'>
//                     <I.Image /> Images
//                     <div>
//                         <Slider
//                             className='relative px-3'
//                             onChange={(next) => (st.gallerySize = next)}
//                             value={st.gallerySize}
//                             style={{ width: '200px' }}
//                             max={1000}
//                             min={32}
//                             step={1}
//                         />
//                     </div>
//                 </div>
//             }
//         >
//             {/* https://github.com/igordanchenko/yet-another-react-lightbox */}
//             <LightBoxUI lbs={uiSt} />
//             <div className='row gap-2 flex-wrap'>
//                 {msg.images.map((img, ix) => (
//                     <Whisper
//                         placement='auto'
//                         speaker={
//                             <Popover>
//                                 <ImageTooltipUI selectedImage={msg.images[ix]} />
//                             </Popover>
//                         }
//                     >
//                         <div className='flex'>
//                             <img
//                                 style={{ height: st.gallerySize }}
//                                 src={img.comfyURL ?? img.localURL}
//                                 onClick={() => uiSt.openGallery(ix)}
//                             />
//                             <div className='flex flex-col'>
//                                 <Rate size='xs' vertical max={5} defaultValue={0} />
//                                 <Button
//                                     size='xs'
//                                     startIcon={<I.FolderFill />}
//                                     // onClick={() => {
//                                     //     st.sendMessageToExtension({
//                                     //         type: 'open-external',
//                                     //         uriString: `file://${img.localAbsolutePath}`,
//                                     //     })
//                                     // }}
//                                 >
//                                     Open
//                                 </Button>
//                                 <Button>script 1</Button>
//                                 <Button onClick={() => (st.currentAction = { type: 'paint', img })}>Paint</Button>
//                                 <Button>script 3</Button>
//                             </div>
//                         </div>
//                     </Whisper>
//                     //     {/* </Whisper> */}
//                     // {/* </div> */}
//                 ))}
//             </div>
//         </Panel>
//     )
//     // }
//     // if (st.showImageAs === 'carousel')
//     //     return (
//     //         <Carousel>
//     //             {msg.uris.map((imgUri) => (
//     //                 <img style={{ objectFit: 'contain' }} src={imgUri} />
//     //             ))}
//     //         </Carousel>
//     //     )
//     // return (
//     //     <div style={{ textAlign: 'center', display: 'flex' }}>
//     //         {msg.uris.map((imgUri) => (
//     //             <div key={imgUri}>
//     //                 <img style={{ margin: '.1rem 0' }} src={imgUri} />
//     //             </div>
//     //         ))}
//     //     </div>
//     // )
// })
