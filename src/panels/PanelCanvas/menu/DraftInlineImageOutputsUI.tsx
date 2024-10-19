import { observer } from 'mobx-react-lite'

export const DraftInlineImageOutputsUI = observer(function DraftInlineImageOutputsUI_(p: { draftID: DraftID }) {
    const draft = cushy.db.draft.get(p.draftID)
    if (!draft) return `❌ draft not found: ${p.draftID}`
    const images = draft.images
    return (
        <div tw='flex gap-1 overflow-auto'>
            {images.map((image) => {
                return (
                    <img //
                        style={{ width: '64px' }}
                        src={image.url}
                    />
                )
            })}
        </div>
    )
})
