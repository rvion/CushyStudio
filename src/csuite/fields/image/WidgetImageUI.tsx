import type { Field_image } from './FieldImage'

import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'

import { createMediaImage_fromBlobObject } from '../../../models/createMediaImage_fromWebFile'
import { FPath } from '../../../models/PathObj'
import { PanelGalleryUI } from '../../../panels/PanelGallery/PanelGallery'
import { useSt } from '../../../state/stateContext'
import { asRelativePath } from '../../../utils/fs/pathUtils'
import { useImageDrop } from '../../../widgets/galleries/dnd'
import { ImageUI } from '../../../widgets/galleries/ImageUI'
import { Button } from '../../button/Button'
import { SpacerUI } from '../../components/SpacerUI'
import { Frame } from '../../frame/Frame'
import { ResizableFrame } from '../../resizableFrame/resizableFrameUI'
import { RevealUI } from '../../reveal/RevealUI'

export const WidgetSelectImageUI = observer(function WidgetSelectImageUI_(p: {
    //
    field: Field_image
}) {
    const field = p.field
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop(st, (imageL) => {
        field.value = imageL
    })
    const image = field.value
    const suggestionsRaw = p.field.config.assetSuggested
    const suggestions: RelativePath[] =
        suggestionsRaw == null ? [] : Array.isArray(suggestionsRaw) ? suggestionsRaw : [suggestionsRaw]
    const size = field.size
    console.log('size: ', size)
    return image != null ? ( //
        <ResizableFrame // Container
            border
            tw='text-sm w-full'
            currentSize={size}
            onResize={(val) => {
                field.size = val
            }}
            snap={16}
            base={{ contrast: -0.025 }}
            header={
                <>
                    <SpacerUI />
                    <RevealUI //
                        relativeTo='mouse'
                        shell='popup-sm'
                        children={<Button subtle icon='mdiImageSearchOutline' />}
                        content={(p) => (
                            <PanelGalleryUI
                                onClick={(img) => {
                                    field.value = img
                                    p.reveal.close()
                                }}
                            />
                        )}
                    />
                    <Button
                        square
                        subtle
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
                                                const fpath = new FPath(`outputs/imported/${filename}`)
                                                const out = await createMediaImage_fromBlobObject(blob, fpath)
                                                field.value = out
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
                        tooltip='reset'
                        square
                        subtle
                        icon={'mdiRestore'}
                        onClick={() => (field.value = cushy.defaultImage)}
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
                <ImageUI img={image} size={field.size} />
            </div>
        </ResizableFrame>
    ) : (
        // TODO(bird_d): Move this inside the resizable frame
        <div>
            <div
                tw={'flex items-center justify-center text-5xl text-red-500'}
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
