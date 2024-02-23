import type { CivitaiModelVersion } from './CivitaiSpec'
import type { KnownModel_Base } from 'src/manager/model-list/KnownModel_Base'
import type { KnownModel_Type } from 'src/manager/model-list/KnownModel_Type'
import type { ModelInfo } from 'src/manager/model-list/model-list-loader-types'

import JsonView from '@uiw/react-json-view'
import { observer, useLocalObservable } from 'mobx-react-lite'

import { formatSize } from 'src/db/getDBStats'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

export const CivitaiResultVersionUI = observer(function CivitaiResultVersionUI_(p: { version: CivitaiModelVersion }) {
    const version = p.version
    const uist = useLocalObservable(() => ({
        ix: 0,
        get image() {
            return version.images[this.ix]
        },
    }))
    const img = uist.image
    const size1 = `${cushy.civitaiConf.fields.imgSize1.value}px`
    const size2 = `${cushy.civitaiConf.fields.imgSize2.value}px`
    return (
        <div tw='flex flex-col gap-1'>
            <RevealUI>
                <div tw='btn btn-sm btn'>Show verion json</div>
                <JsonViewUI value={p.version} />
            </RevealUI>

            <div key={version.id} tw='flex gap-1'>
                <img
                    //
                    loading='lazy'
                    style={{ width: size1, height: size1 }}
                    key={img.url}
                    src={img.url}
                />
                <div tw='flex flex-col flex-1'>
                    <div tw='text-xl font-bold'>{version.name}</div>
                    <div>{version.baseModel}</div>
                    <div>
                        {version.description && (
                            <div tw='text-sm' dangerouslySetInnerHTML={{ __html: version.description }}></div>
                        )}
                        {/* {modelVersion.downloadUrl} */}
                        <h3>Files</h3>
                        {version.files.map((file, ix) => {
                            const mi: ModelInfo = {
                                description: version.description,
                                name: version.name as any,
                                filename: file.name,
                                reference: version.downloadUrl,
                                base: ((): KnownModel_Base => {
                                    // 🔴 TODO: support all knowns Civitai input types
                                    if (version.baseModel === 'SDXL 1.0') return 'SDXL'
                                    if (version.baseModel === 'SD 1.5') return 'SD1.5'
                                    return 'SD1.x'
                                })(),
                                save_path: 'default',
                                type: ((): KnownModel_Type => {
                                    // 🔴 TODO: support all knowns Civitai input types
                                    if (file.type === 'Model') return 'checkpoints'
                                    if (file.type === 'VAE') return 'VAE'
                                    return 'checkpoints'
                                })(),
                                url: file.downloadUrl,
                            }
                            const isBeeingInstalled = cushy.mainHost.manager.modelsBeeingInstalled.has(mi.name as any)
                            return (
                                <div key={ix} tw='bd1'>
                                    <div tw='flex items-center gap-1'>
                                        {file.primary && <div tw='badge badge-primary'>primary</div>}
                                        <div tw='font-bold'>{file.name}</div>
                                    </div>
                                    <div tw='flex'>
                                        <div
                                            tw={[
                                                //
                                                'btn btn-primary btn-sm',
                                                isBeeingInstalled && 'btn-disabled',
                                            ]}
                                            onClick={() => cushy.mainHost.manager.installModel(mi)}
                                        >
                                            {isBeeingInstalled && <div tw='loading loading-spinner'></div>}
                                            <span className='material-symbols-outlined'>download</span>
                                            Download
                                        </div>
                                        <RevealUI>
                                            <div tw='btn btn-sm btn-outline'>ComfyManager?</div>
                                            <JsonViewUI value={mi} />
                                        </RevealUI>
                                    </div>
                                    <div tw='text-sm'>url: {file.downloadUrl}</div>
                                    {/* <div tw='text-sm'>{f.scannedAt}</div> */}
                                    <div tw='text-sm underline'>{formatSize(file.sizeKB * 1000)}</div>
                                    {/* <div tw='text-sm'>pikle scan: {f.pickleScanResult}</div> */}
                                    {/* <div tw='text-sm'>virus scan: {f.virusScanResult}</div> */}
                                    <RevealUI>
                                        <div tw='btn btn-sm btn'>File json</div>
                                        <JsonViewUI value={file} />
                                    </RevealUI>
                                </div>
                            )
                        })}
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
                        style={{ width: size2, height: size2 }}
                        key={img.url}
                        src={img.url}
                    />
                ))}
            </div>
        </div>
    )
})
