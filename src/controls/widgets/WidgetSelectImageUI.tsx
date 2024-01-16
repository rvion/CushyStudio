import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Widget_image, Widget_imageOpt } from 'src/controls/Widget'
import { Button } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'
import { ImageUI } from '../../widgets/galleries/ImageUI'
import { useImageDrop } from '../../widgets/galleries/dnd'
import { useDraft } from '../../widgets/misc/useDraft'

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
            widget.state.imageID = i.id
        })
    })
    const draft = useDraft()
    return (
        <div
            style={dropStyle}
            ref={dropRef}
            className='DROP_IMAGE_HANDLER'
            tw='_WidgetSelectImageUI flex gap-2 p-1 bg-base-100 border border-dashed border-neutral self-center'
        >
            {widget.state.imageID != null ? ( //
                <div tw='flex items-start'>
                    <ImageUI tw='virtualBorder' size={'5rem'} img={draft.db.media_images.getOrThrow(widget.state.imageID)} />
                    {widget instanceof Widget_imageOpt ? (
                        <Button size='sm' onClick={() => (widget.state.active = false)}>
                            X
                        </Button>
                    ) : null}
                </div>
            ) : (
                <div>
                    <div
                        tw={'virtualBorder flex items-center justify-center text-5xl text-red-500'}
                        style={{
                            width: '5rem',
                            height: '5rem',
                        }}
                    >
                        <span className='material-symbols-outlined'>broken_image</span>
                    </div>
                    <div>drop image here</div>
                </div>
            )}
        </div>
    )
})
