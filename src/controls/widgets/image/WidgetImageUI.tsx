import type { Widget_image } from './WidgetImage'

import { observer } from 'mobx-react-lite'

import { createMediaImage_fromPath } from '../../../models/createMediaImage_fromWebFile'
import { useSt } from '../../../state/stateContext'
import { useImageDrop } from '../../../widgets/galleries/dnd'
import { ImageUI } from '../../../widgets/galleries/ImageUI'

export const WidgetSelectImageUI = observer(function WidgetSelectImageUI_(p: { widget: Widget_image }) {
    const widget = p.widget
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop(st, (imageL) => {
        widget.value = imageL
    })
    const image = widget.value
    const suggestionsRaw = p.widget.config.assetSuggested
    const suggestions: RelativePath[] =
        suggestionsRaw == null ? [] : Array.isArray(suggestionsRaw) ? suggestionsRaw : [suggestionsRaw]
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
                        <div tw='whitespace-nowrap'>
                            {image?.width} x {image?.height}
                        </div>
                        <div onClick={() => (widget.value = cushy.defaultImage)} tw='btn btn-xs'>
                            reset
                        </div>
                    </div>
                    {suggestions.length > 0 && (
                        <div tw='bd1'>
                            <div tw='text-xs text-gray-500'>suggested</div>
                            {suggestions.map((relPath) => (
                                <img
                                    key={relPath}
                                    tw='w-16 h-16 object-cover cursor-pointer'
                                    onClick={() => (widget.value = createMediaImage_fromPath(st, relPath))}
                                    src={relPath}
                                    alt='suggested asset'
                                />
                            ))}
                        </div>
                    )}
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
