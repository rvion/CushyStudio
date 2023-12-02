import { marked } from 'marked'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Widget_CustomComponentPropsUI, Widget_markdown } from 'src/controls/Widget'
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
        return <ImageUI img={draft.db.media_images.getOrThrow(imageId)} />
    },
}
