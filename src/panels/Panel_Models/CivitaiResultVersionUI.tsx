import type { CivitaiModelVersion } from './CivitaiSpec'

import JsonView from '@uiw/react-json-view'
import { observer, useLocalObservable } from 'mobx-react-lite'

import { formatSize } from 'src/db/getDBStats'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

export const CivitaiResultVersionUI = observer(function CivitaiResultVersionUI_(p: { v: CivitaiModelVersion }) {
    const modelVersion = p.v
    const uist = useLocalObservable(() => ({
        ix: 0,
        get image() {
            return modelVersion.images[this.ix]
        },
    }))
    const img = uist.image
    const size1 = `${cushy.civitaiConf.fields.imgSize1.value}px`
    const size2 = `${cushy.civitaiConf.fields.imgSize2.value}px`
    return (
        <div tw='flex flex-col gap-1'>
            <div key={modelVersion.id} tw='flex gap-1'>
                <img
                    //
                    loading='lazy'
                    style={{ width: size1, height: size1 }}
                    key={img.url}
                    src={img.url}
                />
                <div tw='flex flex-col flex-1'>
                    <div tw='text-xl font-bold'>{modelVersion.name}</div>
                    <div>
                        {modelVersion.description && (
                            <div tw='text-sm' dangerouslySetInnerHTML={{ __html: modelVersion.description }}></div>
                        )}
                        <h3>Files</h3>
                        {modelVersion.files.map((f, ix) => {
                            const targetLocation = {}
                            return (
                                <div key={ix} tw='bd1'>
                                    <div tw='flex items-center gap-1'>
                                        {f.primary && <div tw='badge badge-primary'>primary</div>}
                                        <div tw='font-bold'>{f.name}</div>
                                    </div>
                                    <div tw='btn btn-primary btn-sm'>
                                        <span className='material-symbols-outlined'>download</span>
                                        Download to
                                    </div>
                                    <div tw='text-sm'>url: {f.downloadUrl}</div>
                                    {/* <div tw='text-sm'>{f.scannedAt}</div> */}
                                    <div tw='text-sm underline'>{formatSize(f.sizeKB * 1000)}</div>
                                    {/* <div tw='text-sm'>pikle scan: {f.pickleScanResult}</div> */}
                                    {/* <div tw='text-sm'>virus scan: {f.virusScanResult}</div> */}
                                    <RevealUI>
                                        <div tw='btn btn-sm btn'>show json </div>
                                        <JsonViewUI value={f} />
                                    </RevealUI>
                                </div>
                            )
                        })}
                    </div>
                </div>
                {/* {v.trainedWords && <div tw='text-sm'>{v.trainedWords}</div>} */}
            </div>
            <div tw='flex flex-row gap-1'>
                {modelVersion.images.map((img, ix) => (
                    <img
                        //
                        onMouseEnter={() => (uist.ix = ix)}
                        loading='lazy'
                        style={{ width: size2, height: size2 }}
                        key={img.url}
                        src={img.url}
                    />
                ))}
            </div>
        </div>
    )
})
