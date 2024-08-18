import { observer } from 'mobx-react-lite'

import { useGalleryConf } from './galleryConf'

export const GallerySearchControlsUI = observer(function GallerySearchControlsUI_(p: {}) {
    const conf = useGalleryConf()
    return (
        <div tw='flex gap-1 items-center'>
            {/* {conf.fields.filterPath.header()} */}
            {/* {conf.fields.filterAppName.header()} */}
            {conf.fields.filterTag.header()}
            {/* {conf.fields.filterStar.header()} */}
            {/* <input
                tw='csuite-basic-input my-0.5'
                placeholder='filename'
                value={cushy.galleryFilterPath ?? ''}
                type='text'
                onChange={(x) => {
                    const next = x.target.value
                    if (!next) cushy.galleryFilterPath = null
                    else cushy.galleryFilterPath = next
                }}
            />
            <Button
                square
                icon='mdiStar'
                active={cushy.galleryFilterStar}
                onClick={() => (cushy.galleryFilterStar = !cushy.galleryFilterStar)}
            />
            <input
                tw='csuite-basic-input my-0.5'
                placeholder='tags'
                value={cushy.galleryFilterTag ?? ''}
                type='text'
                onChange={(x) => {
                    const next = x.target.value
                    if (!next) cushy.galleryFilterTag = null
                    else cushy.galleryFilterTag = next
                }}
            /> */}
            {/* <SelectUI
                key='45'
                placeholder='filter by app'
                label='app'
                options={() => cushy.db.cushy_app.selectRaw((q) => q.select(['id', 'name']))}
                getLabelText={(i) => i.name ?? 'unnamed'}
                value={() => cushy.galleryFilterAppName}
                equalityCheck={(a, b) => a.id === b.id}
                onOptionToggled={(next) => {
                    if (cushy.galleryFilterAppName?.id === next.id) cushy.galleryFilterAppName = null
                    else cushy.galleryFilterAppName = next
                }}
                cleanable
            /> */}
        </div>
    )
})
