import { marked } from 'marked'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Widget_CustomComponentPropsUI, Widget_markdown } from 'src/controls/Widget'
import { MediaImageL } from 'src/models/MediaImage'
import { ImageUI } from 'src/widgets/galleries/ImageUI'
import { useDraft } from 'src/widgets/misc/useDraft'

export const WidgetMardownUI = observer(function WidgetMardownUI_(p: { req: Widget_markdown }) {
    const req = p.req

    return (
        <>
            {/* {value}
            {req.renderId} */}
            {req.customComponent && (
                <req.customComponent
                    key={req.renderId}
                    value={req.componentValue}
                    onChange={(v) => (req.componentValue = v)}
                    ui={ui}
                />
            )}
            {!req.customComponent && (
                <div //
                    className='_MD w-full'
                    dangerouslySetInnerHTML={{ __html: marked(req.markdown) }}
                ></div>
            )}
        </>
    )
})

const ui: Widget_CustomComponentPropsUI = {
    image: ({ imageId }: { imageId: string }): JSX.Element => {
        const draft = useDraft()
        const [image, setImage] = useState(undefined as undefined | MediaImageL)
        useEffect(() => {
            const timeoutId = setTimeout(() => {
                setImage(draft.db.media_images.getOrThrow(imageId))
            }, 100)
            return () => {
                clearTimeout(timeoutId)
            }
        }, [imageId])
        return <ImageUI img={image ?? (`loading` as unknown as MediaImageL)} />
    },
}
