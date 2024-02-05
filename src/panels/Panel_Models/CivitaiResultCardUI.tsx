import type { Civitai, CivitaiSearchResultItem } from './CivitaiSpec'

import { observer } from 'mobx-react-lite'

export const CivitaiResultCardUI = observer(function CivitaiResultCardUI_(p: {
    //
    civitai: Civitai
    item: CivitaiSearchResultItem
}) {
    const item = p.item
    const v0 = item.modelVersions[0]
    const v0Imgs = v0.images
    const img0 = v0Imgs[0]
    const active = p.civitai.selectedResult === item
    return (
        <div
            style={{ borderBottom: '1px solid #777' }}
            onClick={() => (p.civitai.selectedResult = item)}
            tw={[
                //
                'w-80',
                active && 'bg-base-300',
                'hover:bg-base-200 cursor-pointer',
            ]}
        >
            <div tw={['flex gap-0.5']}>
                <img
                    //
                    style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                    tw='flex-none'
                    key={img0.url}
                    src={img0.url}
                />
                <div>
                    <div tw='font-bold'>{item.name}</div>
                    <div tw='opacity-50 text-sm'>{item.modelVersions.length} version</div>
                    {item.nsfw ? <div tw='badge badge-accent'>nsfw</div> : null}
                    {item.tags ? (
                        <div tw='flex flex-wrap gap-1'>
                            {item.tags.map((tag) => (
                                <div tw='badge badge-neutral badge-sm'>{tag}</div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
            <div //
                tw='line-clamp-3 text-sm'
                dangerouslySetInnerHTML={{ __html: item.description }}
            ></div>
        </div>
    )
})
