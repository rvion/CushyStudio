import type { Widget_image } from './WidgetImage'

import { observer } from 'mobx-react-lite'

import { useSt } from 'src/state/stateContext'
import { useImageDrop } from 'src/widgets/galleries/dnd'
import { ImageUI } from 'src/widgets/galleries/ImageUI'

export const WidgetSelectImageUI = observer(function WidgetSelectImageUI_(p: { widget: Widget_image }) {
    const widget = p.widget
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop(st, (imageL) => {
        widget.value = imageL
    })
    const image = widget.value
    return (
        <div
            style={dropStyle}
            ref={dropRef}
            className='DROP_IMAGE_HANDLER'
            tw='_WidgetSelectImageUI flex gap-2 p-1 bg-base-100 self-center'
        >
            {image != null ? ( //
                <div tw='flex items-start gap-1'>
                    <ImageUI tw='virtualBorder' size={'5rem'} img={image} />
                    <div tw='text-sm italic text-gray-500'>
                        <div>width: {image?.width}</div>
                        <div>height: {image?.height}</div>
                    </div>
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
