import type { Civitai, CivitaiModelVersion, CivitaiSearchResultItem, ModelImage } from './CivitaiSpec'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { useEffect } from 'react'

import { CivitaiResultVersionUI } from './CivitaiResultVersionUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

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
                <div tw='flex-1'></div>
                <RevealUI>
                    <div tw='btn btn-sm btn'>Show full json</div>
                    <JsonViewUI value={item} />
                </RevealUI>
            </div>

            {item.nsfw ? <div tw='badge badge-error'>nsfw</div> : null}
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
                {selected.version && <CivitaiResultVersionUI key={selected.version.id} version={selected.version} />}
            </div>
        </div>
    )
})
