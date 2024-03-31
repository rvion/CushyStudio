import type { CivitaiModelVersion, CivitaiSearchResultItem } from './CivitaiSpec'

import { observer, useLocalObservable } from 'mobx-react-lite'

import { CivitaiDownloadableFileUI } from './CivitaiDownloadableFileUI'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { JsonViewUI } from '../../widgets/workspace/JsonViewUI'

export const CivitaiResultVersionUI = observer(function CivitaiResultVersionUI_(p: {
    //
    entry: CivitaiSearchResultItem
    version: CivitaiModelVersion
}) {
    const version = p.version
    const uist = useLocalObservable(() => ({
        ix: 0,
        get image() {
            return version.images[this.ix]
        },
    }))
    const img = uist.image
    const imgUrl = img?.url // ?? noImage
    const size1 = `${cushy.civitaiConf.fields.imgSize1.value}px`
    const size2 = `${cushy.civitaiConf.fields.imgSize2.value}px`

    return (
        <div tw='flex flex-col gap-1'>
            <div key={version.id} tw='flex gap-1'>
                <img
                    //
                    loading='lazy'
                    style={{ width: size1, height: size1, objectFit: 'contain' }}
                    src={imgUrl}
                />
                <div tw='flex flex-col flex-1'>
                    <div // key infos
                        tw='flex gap-2'
                    >
                        <div tw='badge badge-lg badge-neutral'>version={version.name}</div>
                        <div tw='badge badge-lg badge-neutral'>baseModel={version.baseModel}</div>
                        <RevealUI tw='ml-auto' content={() => <JsonViewUI value={p.version} />}>
                            <div tw='btn btn-xs btn-outline'>Show version json</div>
                        </RevealUI>
                    </div>
                    <div tw='flex flex-col gap-1'>
                        {version.description && (
                            <div tw='text-sm' dangerouslySetInnerHTML={{ __html: version.description }}></div>
                        )}
                        {/* {modelVersion.downloadUrl} */}
                        <div // trigger words infos
                            tw='flex items-center flex-gap'
                        >
                            Trigger words:
                            <div tw='text-sm'>
                                {version.trainedWords.map((w) => (
                                    <div tw='kbd'>{w}</div>
                                ))}
                            </div>
                        </div>
                        {/* <h3>Files</h3> */}
                        {version.files.map((file, ix) => (
                            <CivitaiDownloadableFileUI //
                                entry={p.entry}
                                version={version}
                                key={ix}
                                file={file}
                            />
                        ))}
                    </div>
                </div>
                {/* {v.trainedWords && <div tw='text-sm'>{v.trainedWords}</div>} */}
            </div>
            <div tw='flex flex-row gap-1'>
                {version.images.map((img, ix) => (
                    <img
                        //
                        onMouseEnter={() => (uist.ix = ix)}
                        loading='lazy'
                        style={{ width: size2, height: size2, objectFit: 'contain' }}
                        key={img.url}
                        src={img.url}
                    />
                ))}
            </div>
        </div>
    )
})
