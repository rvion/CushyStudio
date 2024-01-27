import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useSt } from 'src/state/stateContext'
import { ImageUI } from 'src/widgets/galleries/ImageUI'
import { useImageDrop } from 'src/widgets/galleries/dnd'
import { useDraft } from 'src/widgets/misc/useDraft'
import { Widget_image } from './WidgetImage'

export const WidgetSelectImageUI = observer(function WidgetSelectImageUI_(p: { widget: Widget_image }) {
    const widget = p.widget
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop(st, (i) => {
        runInAction(() => {
            // console.log('DROPPED', JSON.stringify(i.data, null, 3))
            widget.serial.active = true
            widget.serial.imageID = i.id
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
            {widget.serial.imageID != null ? ( //
                <div tw='flex items-start'>
                    <ImageUI tw='virtualBorder' size={'5rem'} img={draft.db.media_images.getOrThrow(widget.serial.imageID)} />
                    {/* {widget instanceof Widget_imageOpt ? (
                        <Button size='sm' onClick={() => (widget.state.active = false)}>
                            X
                        </Button>
                    ) : null} */}
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
