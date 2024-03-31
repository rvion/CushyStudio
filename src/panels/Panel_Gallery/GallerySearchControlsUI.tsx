import { observer } from 'mobx-react-lite'

import { SelectUI } from '../../rsuite/SelectUI'

export const GallerySearchControlsUI = observer(function GallerySearchControlsUI_(p: {}) {
    return (
        <div tw='flex gap-1'>
            <input
                tw='input my-0.5 input-xs'
                placeholder='filename'
                value={cushy.galleryFilterPath ?? ''}
                type='text'
                onChange={(x) => {
                    const next = x.target.value
                    if (!next) cushy.galleryFilterPath = null
                    else cushy.galleryFilterPath = next
                }}
            />

            <input
                tw='input my-0.5 input-xs'
                placeholder='tags'
                value={cushy.galleryFilterTag ?? ''}
                type='text'
                onChange={(x) => {
                    const next = x.target.value
                    if (!next) cushy.galleryFilterTag = null
                    else cushy.galleryFilterTag = next
                }}
            />
            <SelectUI
                key='45'
                placeholder='filter by app'
                label='app'
                options={() => cushy.db.cushy_app.selectRaw((q) => q.select(['id', 'name']))}
                getLabelText={(i) => i.name ?? 'unnamed'}
                value={() => cushy.galleryFilterAppName}
                equalityCheck={(a, b) => a.id === b.id}
                onChange={(next) => {
                    if (cushy.galleryFilterAppName?.id === next.id) cushy.galleryFilterAppName = null
                    else cushy.galleryFilterAppName = next
                }}
                cleanable
            />
        </div>
    )
})
