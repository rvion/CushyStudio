import type { Civitai, CivitaiModelVersion, CivitaiSearchResultItem, ModelImage } from './CivitaiSpec'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { useEffect } from 'react'

export const CivitaiResultFullUI = observer(function CivitaiResultFullUI_(p: {
    //
    civitai: Civitai
    item: CivitaiSearchResultItem
}) {
    const item = p.item
    const selected = useLocalObservable(() => ({
        version: item.modelVersions[0] as Maybe<CivitaiModelVersion>,
        //
    }))
    useEffect(() => {
        selected.version = item.modelVersions[0]
    }, [item.modelVersions[0]])

    return (
        <div tw='flex flex-col gap-1 p-2'>
            <div tw='flex gap-1 items-baseline'>
                <div tw='text-2xl font-bold'>{item.name}</div>
                <div tw='italic opacity-50'>#{item.id}</div>
            </div>

            {item.nsfw ? <div tw='badge badge-accent'>nsfw</div> : null}
            {item.tags ? (
                <div tw='flex flex-wrap gap-1'>
                    {item.tags.map((tag) => (
                        <div tw='badge badge-neutral badge-sm'>{tag}</div>
                    ))}
                </div>
            ) : null}

            <div //
                tw='line-clamp-3 text-sm'
                dangerouslySetInnerHTML={{ __html: item.description }}
            ></div>

            <div tw='flex flex-wrap gap-0.5'>
                {item.modelVersions.map((version: CivitaiModelVersion) => (
                    <div
                        key={version.id}
                        tw={['btn', selected.version === version ? 'btn-primary' : 'btn-outline']}
                        onClick={() => {
                            selected.version = version
                        }}
                    >
                        <img style={{ width: '2rem', height: '2rem' }} src={version.images[0]?.url} />
                        <span>{version.name}</span>
                    </div>
                ))}
            </div>
            <div tw='flex flex-col gap-1'>
                {/*  */}
                {selected.version && <CivitaiResultVersionUI v={selected.version} />}
            </div>
        </div>
    )
})

export const CivitaiResultVersionUI = observer(function CivitaiResultVersionUI_(p: { v: CivitaiModelVersion }) {
    const v = p.v
    const img0: Maybe<ModelImage> = v.images[0]
    return (
        <div tw='flex flex-col gap-1'>
            <div key={v.id} tw='flex gap-1'>
                <img
                    //
                    loading='lazy'
                    style={{ width: '300px', height: '300px' }}
                    key={img0.url}
                    src={img0.url}
                />
                <div tw='flex flex-col flex-1'>
                    <div tw='text-xl font-bold'>{v.name}</div>
                    <div>{v.description && <div tw='text-sm' dangerouslySetInnerHTML={{ __html: v.description }}></div>}</div>
                </div>
                {/* {v.trainedWords && <div tw='text-sm'>{v.trainedWords}</div>} */}
            </div>
            <div tw='flex flex-row gap-1'>
                {v.images.map((img) => (
                    <img
                        //
                        loading='lazy'
                        style={{ width: '64px', height: '64px' }}
                        key={img.url}
                        src={img.url}
                    />
                ))}
            </div>
        </div>
    )
})
