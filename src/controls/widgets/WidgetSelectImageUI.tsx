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
export const WidgetSelectImageUI = observer(function WidgetSelectImageUI_(p: { widget: Widget_image | Widget_imageOpt }) {
    const widget = p.widget
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop(st, (i) => {
        runInAction(() => {
            // console.log('DROPPED', JSON.stringify(i.data, null, 3))
            widget.state.active = true
            widget.state.cushy = { type: 'CushyImage', imageID: i.id }
            widget.state.pick = 'cushy'
        })
    })
    const draft = useDraft()
    const tabs = [
        {
            title: () => <>Drop</>,
            body: () => (
                <div className='flex gap-2 p-1 bg-base-100 border border-dashed border-neutral self-center'>
                    {widget.state.cushy != null ? ( //
                        <div tw='flex items-start'>
                            <ImageUI img={draft.db.media_images.getOrThrow(widget.state.cushy.imageID)} />
                            {widget instanceof Widget_imageOpt ? (
                                <Button size='sm' onClick={() => (widget.state.active = false)}>
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
                    {widget.state.comfy && (
                        <img
                            style={{ width: '7rem', height: '7rem' }}
                            src={`${st.getServerHostHTTP()}/view?filename=${encodeURIComponent(
                                widget.state.comfy.imageName,
                            )}&type=input&subfolder=`}
                            alt=''
                        />
                    )}

                    <EnumSelectorUI
                        enumName='Enum_LoadImage_image'
                        // value={req.state.comfy?.imageName ?? null}
                        value={() => st.fixEnumValue(widget.state.comfy?.imageName, 'Enum_LoadImage_image', widget.isOptional)}
                        isOptional={widget.state.pick !== 'comfy' || !widget.state.active}
                        onChange={(t) => {
                            // handle nullability for Widget_imageOpt
                            if (
                                t == null &&
                                (widget instanceof Widget_imageOpt || widget instanceof Widget_image) &&
                                widget.state.active &&
                                widget.state.pick === 'comfy'
                            ) {
                                widget.state.active = false
                            }

                            if (t == null) return
                            // handle value
                            widget.state.comfy.imageName = t as Enum_LoadImage_image
                            widget.state.pick = 'comfy'
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
                        widget.state.paint = { type: 'PaintImage', base64 }
                        if (widget.state.pick !== 'paint') widget.state.pick = 'paint'
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
        !widget.state.active || widget.state.pick === 'cushy'
            ? Tab.Cushy
            : widget.state.pick === 'comfy'
            ? Tab.Comfy
            : widget.state.pick === 'paint'
            ? Tab.Scribble
            : widget.state.pick === 'asset'
            ? Tab.Asset
            : Tab.Asset

    return (
        <div>
            <div style={dropStyle} ref={dropRef} className='_WidgetSelectImageUI flexflex-row items-center'>
                <TabsUI
                    current={current}
                    tabs={tabs}
                    disabled={!widget.state.active}
                    onClick={(i) => {
                        // if (i === Tab.None && req instanceof Widget_imageOpt) req.state.active = false
                        widget.state.active = true
                        if (i === Tab.Cushy) widget.state.pick = 'cushy'
                        if (i === Tab.Comfy) widget.state.pick = 'comfy'
                        if (i === Tab.Scribble) widget.state.pick = 'paint'
                        if (i === Tab.Asset) widget.state.pick = 'asset'
                    }}
                />
            </div>
        </div>
    )
})
