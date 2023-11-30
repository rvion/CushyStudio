import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Widget_image, Widget_imageOpt } from 'src/controls/Widget'
import { Button } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'
import { ImageUI } from '../../widgets/galleries/ImageUI'
import { useImageDrop } from '../../widgets/galleries/dnd'
import { ScribbleCanvas } from '../../widgets/misc/ScribbleUI'
import { TabsUI } from '../../widgets/misc/TabUI'
import { useDraft } from '../../widgets/misc/useDraft'
import { EnumSelectorUI } from './WidgetEnumUI'

enum Tab {
    Cushy = 0,
    Comfy = 1,
    Scribble = 2,
    Asset = 3,
}
export const WidgetSelectImageUI = observer(function WidgetSelectImageUI_(p: { req: Widget_image | Widget_imageOpt }) {
    const req = p.req
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop(st, (i) => {
        runInAction(() => {
            console.log('DROPPED', i)
            req.state.active = true
            req.state.cushy = { type: 'CushyImage', imageID: i.id }
            req.state.pick = 'cushy'
        })
    })
    const draft = useDraft()
    const tabs = [
        {
            title: () => <>Drop</>,
            body: () => (
                <div className='flex gap-2 p-1 bg-base-100 border border-dashed border-neutral self-center'>
                    {req.state.cushy != null ? ( //
                        <div tw='flex items-start'>
                            <ImageUI img={draft.db.media_images.getOrThrow(req.state.cushy.imageID)} />
                            {req instanceof Widget_imageOpt ? (
                                <Button size='sm' onClick={() => (req.state.active = false)}>
                                    X
                                </Button>
                            ) : null}
                        </div>
                    ) : (
                        <span>drop image here</span>
                    )}
                </div>
            ),
        },
        {
            title: () => <>Pick</>,
            body: () => (
                <>
                    {req.state.comfy && (
                        <img
                            style={{ width: '7rem', height: '7rem' }}
                            src={`${st.getServerHostHTTP()}/view?filename=${encodeURIComponent(
                                req.state.comfy.imageName,
                            )}&type=input&subfolder=`}
                            alt=''
                        />
                    )}

                    <EnumSelectorUI
                        enumName='Enum_LoadImage_image'
                        // value={req.state.comfy?.imageName ?? null}
                        value={st.fixEnumValue(req.state.comfy?.imageName, 'Enum_LoadImage_image', req.isOptional)}
                        isOptional={req.state.pick !== 'comfy' || !req.state.active}
                        onChange={(t) => {
                            // handle nullability for Widget_imageOpt
                            if (
                                t == null &&
                                (req instanceof Widget_imageOpt || req instanceof Widget_image) &&
                                req.state.active &&
                                req.state.pick === 'comfy'
                            ) {
                                req.state.active = false
                            }

                            if (t == null) return
                            // handle value
                            req.state.comfy.imageName = t as Enum_LoadImage_image
                            req.state.pick = 'comfy'
                        }}
                    />
                </>
            ),
        },
        {
            title: () => <>Scribble</>,
            body: () => (
                <ScribbleCanvas
                    tw='p-2'
                    // style={{ border: '1px solid black' }}
                    fillStyle='black'
                    strokeStyle='white'
                    onChange={(base64: string) => {
                        req.state.paint = { type: 'PaintImage', base64 }
                        if (req.state.pick !== 'paint') req.state.pick = 'paint'
                    }}
                />
            ),
        },
    ]

    // if (req instanceof Widget_imageOpt) {
    //     tabs.unshift({
    //         title: () => <>None</>,
    //         body: () => <div>No image</div>,
    //     })
    // }
    const current =
        !req.state.active || req.state.pick === 'cushy'
            ? Tab.Cushy
            : req.state.pick === 'comfy'
            ? Tab.Comfy
            : req.state.pick === 'paint'
            ? Tab.Scribble
            : req.state.pick === 'asset'
            ? Tab.Asset
            : Tab.Asset

    return (
        <div>
            <div style={dropStyle} ref={dropRef} className='flexflex-row items-center'>
                <TabsUI
                    current={current}
                    tabs={tabs}
                    disabled={!req.state.active}
                    onClick={(i) => {
                        // if (i === Tab.None && req instanceof Widget_imageOpt) req.state.active = false
                        req.state.active = true
                        if (i === Tab.Cushy) req.state.pick = 'cushy'
                        if (i === Tab.Comfy) req.state.pick = 'comfy'
                        if (i === Tab.Scribble) req.state.pick = 'paint'
                        if (i === Tab.Asset) req.state.pick = 'asset'
                    }}
                />
            </div>
        </div>
    )
})
