import type { Civitai, CivitaiModelVersion, CivitaiSearchResultItem } from './CivitaiSpec'

import { observer } from 'mobx-react-lite'

import { RevealUI } from '../../rsuite/reveal/RevealUI'

export const CivitaiResultCardUI = observer(function CivitaiResultCardUI_(p: {
    //
    civitai: Civitai
    item: CivitaiSearchResultItem
}) {
    const item = p.item
    const v0: Maybe<CivitaiModelVersion> = item.modelVersions[0]
    const v0Imgs = v0?.images
    const img0 = v0Imgs?.[0]
    const active = p.civitai.selectedResult === item
    return (
        <div
            style={{ borderBottom: '1px solid #777' }}
            onClick={() => (p.civitai.selectedResult = item)}
            tw={[
                //
                'w-80',
                active && 'bg-base-300',
                'hover:cursor-pointer',
            ]}
        >
            <div tw={['flex gap-0.5']}>
                {img0 && (
                    <img
                        //
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                        tw='flex-none'
                        key={img0.url}
                        src={img0.url}
                    />
                )}
                <div>
                    <div tw='font-bold'>{item.name}</div>
                    <div tw='flex items-center gap-1'>
                        <div tw='opacity-50 text-sm'>{item.modelVersions.length} version</div>
                        <div tw='flex-1'></div>
                        <div
                            tw={[
                                'badge badge-sm text-black',
                                item.type === 'Checkpoint'
                                    ? 'bg-yellow-600'
                                    : item.type === 'LORA'
                                      ? 'bg-blue-500'
                                      : 'bg-green-400',
                            ]}
                        >
                            {item.type}
                        </div>
                        {item.nsfw ? <div tw='badge badge-sm badge-error'>nsfw</div> : null}
                    </div>
                    {item.tags ? (
                        <div tw='flex flex-wrap gap-1'>
                            {item.tags.slice(0, 10).map((tag) => (
                                <div key={tag} tw='badge badge-neutral badge-sm'>
                                    {tag}
                                </div>
                            ))}
                            {item.tags.length > 10 ? (
                                <RevealUI
                                    trigger='hover'
                                    content={() => (
                                        <div>
                                            {item.tags.slice(10).map((tag) => (
                                                <div key={tag} tw='badge badge-neutral badge-sm'>
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                >
                                    <div tw='badge badge-neutral badge-sm font-bold'>+{item.tags.length - 10} more</div>
                                </RevealUI>
                            ) : null}
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
