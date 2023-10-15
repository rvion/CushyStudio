import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { Requestable_image, Requestable_imageOpt } from 'src/controls/InfoRequest'
import { useSt } from '../../../front/FrontStateCtx'
import { ImageUI } from '../galleries/ImageUI'
import { useImageDrop } from '../galleries/dnd'
import { useDraft } from '../useDraft'
import { EnumSelectorUI, WidgetEnumUI } from './WidgetEnumUI'

export const WidgetSelectImageUI = observer(function WidgetSelectImageUI_(p: { req: Requestable_image | Requestable_imageOpt }) {
    const req = p.req
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop((i) => {
        req.state.cushy = { type: 'CushyImage', imageID: i.id }
    })
    const draft = useDraft()
    // const node = draft.graph.item.findNodeByType('VAEDecode')
    return (
        <div>
            <div className='flex gap-2 flex-row '>
                {/* CUSHY */}
                <div ref={dropRef} className='flex gap-2 bg-yellow-900 rounded p-1 self-center' style={dropStyle}>
                    {req.state.pick === 'cushy' && req.state.cushy != null ? ( //
                        <ImageUI img={draft.db.images.getOrThrow(req.state.cushy.imageID)} />
                    ) : (
                        <span>drop image here</span>
                    )}
                </div>
                {/* SCRIBBLE */}
                {/* TODO */}

                {/* COMFY */}
                <div>
                    {req.state.comfy && (
                        <img
                            style={{ width: '32px', height: '32px' }}
                            src={`${st.getServerHostHTTP()}/view?filename=${encodeURIComponent(
                                req.state.comfy.imageName,
                            )}&type=input&subfolder=`}
                            alt=''
                        />
                    )}

                    <EnumSelectorUI
                        enumName='Enum_LoadImage_image'
                        value={req.state.comfy?.imageName ?? null}
                        isOptional={req.state.pick !== 'comfy' || !req.state.active}
                        onChange={(t) => {
                            // handle nullability for Requestable_imageOpt
                            if (
                                t == null &&
                                req instanceof Requestable_imageOpt &&
                                req.state.active &&
                                req.state.pick === 'comfy'
                            ) {
                                req.state.active = false
                            }

                            if (t == null) return
                            // handle value
                            req.state.comfy.imageName
                            req.state.pick = 'comfy'
                        }}
                    />
                </div>
                {req instanceof Requestable_imageOpt ? (
                    <Button size='sm' onClick={() => (req.state.active = false)}>
                        <span className='material-symbols-outlined'>remove</span>
                    </Button>
                ) : null}
            </div>
        </div>
    )
})

// ❓ <span
// ❓     style={{
// ❓         // whiteSpace: 'pre-wrap',
// ❓         wordWrap: 'break-word',
// ❓     }}
// ❓ >
// ❓     {/* {JSON.stringify(answer ?? { '❌': '❌' }, null, 3)} */}
// ❓     {/* le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le */}
// ❓     {/* chat */}
// ❓ </span>

// {/* {infos.map((info) => {
//     const url = info.comfyURL
//     return (
//         <RadioGroup value={checkedURL?.comfyURL} name='radioList'>
//             <div key={url} onClick={() => set(info)} className='hover:bg-gray-500'>
//                 <img
//                     onClick={() => (lbs.opened = true)}
//                     style={{
//                         cursor: 'pointer',
//                         objectFit: 'contain',
//                         width: '32px',
//                         height: '32px',
//                     }}
//                     src={url}
//                     alt=''
//                 />
//                 <Radio value={url} onChange={() => set(info)} />
//             </div>
//         </RadioGroup>
//     )
// })} */}

// {/* <LightBoxUI lbs={lbs} /> */}
