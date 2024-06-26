import type { Widget_image } from './WidgetImage'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'

import { createMediaImage_fromBlobObject } from '../../../models/createMediaImage_fromWebFile'
import { useSt } from '../../../state/stateContext'
import { asRelativePath } from '../../../utils/fs/pathUtils'
import { useImageDrop } from '../../../widgets/galleries/dnd'
import { ImageUI } from '../../../widgets/galleries/ImageUI'
import { Button } from '../../button/Button'
import { Frame } from '../../frame/Frame'
import { ResizableFrame } from '../../resizableFrame/resizableFrameUI'
import { SpacerUI } from '../spacer/SpacerUI'

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
    const size = widget.size
    console.log('size: ', size)
    return image != null ? ( //
        <ResizableFrame // Container
            border
            tw='text-sm w-full'
            currentSize={size}
            onResize={(val) => {
                widget.size = val
            }}
            snap={16}
            base={{ contrast: -0.025 }}
            header={
                <>
                    <SpacerUI />
                    <Button
                        square
                        icon='mdiContentPaste'
                        onClick={() => {
                            // XXX: This is slow, should probably be done through electron's api, but works for now. Could also be made re-usable? getImageFromClipboard()?
                            navigator.clipboard
                                .read()
                                .then(async (clipboardItems) => {
                                    for (const clipboardItem of clipboardItems) {
                                        for (const type of clipboardItem.types) {
                                            if (type == 'image/png') {
                                                const blob = await clipboardItem.getType(type)
                                                const imageID = nanoid()
                                                const filename = `${imageID}.png`

                                                const relPath = asRelativePath(`outputs/imported/${filename}`)

                                                const out = await createMediaImage_fromBlobObject(cushy, blob, relPath)
                                                widget.value = out
                                            }
                                        }
                                    }
                                })
                                .catch((err) => {
                                    console.error(err)
                                })
                        }}
                    />
                    <Button //
                        square
                        icon={'mdiRestore'}
                        onClick={() => (widget.value = cushy.defaultImage)}
                    />
                </>
            }
            footer={
                <Frame // Dimensions
                    tw='w-full h-full pointer-events-none !bg-transparent'
                >
                    {image?.width} x {image?.height}
                </Frame>
            }
        >
            <div
                style={dropStyle}
                ref={dropRef}
                className='DROP_IMAGE_HANDLER'
                tw='_WidgetSelectImageUI flex flex-1 w-full h-full'
            >
                <ImageUI img={image} size={widget.size} />
            </div>
        </ResizableFrame>
    ) : (
        // TODO(bird_d): Move this inside the resizable frame
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
    )
})

// {
//     // bird_d: Dunno how to test this or what it even is.
//     /* {suggestions.length > 0 && (
//                         <div tw='bd1'>
//                             <div tw='text-xs text-gray-500'>suggested</div>
//                             {suggestions.map((relPath) => (
//                                 <img
//                                     key={relPath}
//                                     tw='w-16 h-16 object-cover cursor-pointer'
//                                     onClick={() => (widget.value = createMediaImage_fromPath(st, relPath))}
//                                     src={relPath}
//                                     alt='suggested asset'
//                                 />
//                             ))}
//                         </div>
//                     )} */
// }
