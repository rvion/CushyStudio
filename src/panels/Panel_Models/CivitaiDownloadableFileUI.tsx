import type { CivitaiDownloadableFile, CivitaiModelVersion } from './CivitaiSpec'
import type { ModelInfo } from 'src/manager/model-list/model-list-loader-types'

import { observer, useLocalObservable } from 'mobx-react-lite'

import { CivitaiWarningAPIKeyMissingUI } from './CivitaiWarningAPIKeyMissingUI'
import { formatSize } from 'src/db/getDBStats'
import { knownModel_Base, type KnownModel_Base } from 'src/manager/model-list/KnownModel_Base'
import { knownModel_SavePath, type KnownModel_SavePath } from 'src/manager/model-list/KnownModel_SavePath'
import { knownModel_Type, type KnownModel_Type } from 'src/manager/model-list/KnownModel_Type'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { SelectUI } from 'src/rsuite/SelectUI'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

export const CivitaiDownloadableFileUI = observer(function CivitaiDownloadableFileUI_(p: {
    //
    version: CivitaiModelVersion
    file: CivitaiDownloadableFile
}) {
    const file: CivitaiDownloadableFile = p.file
    const version: CivitaiModelVersion = p.version
    const apiKey = cushy.civitaiConf.fields.apiKey.value
    const uist = useLocalObservable(() => ({
        base: ((): KnownModel_Base => {
            // 🔴 TODO: support all knowns Civitai input types
            if (version.baseModel === 'SDXL 1.0') return 'SDXL'
            if (version.baseModel === 'SD 1.5') return 'SD1.5'
            console.log(`[❌ MISSING CIVITAI to MANAGER rule] unknown base: ${version.baseModel}`)
            return 'SD1.x'
        })(),
        type: ((): KnownModel_Type => {
            // 🔴 TODO: support all knowns Civitai input types
            if (file.type === 'Model') return 'checkpoints'
            if (file.type === 'VAE') return 'VAE'
            console.log(`[❌ MISSING CIVITAI to MANAGER rule] unknown type: ${version.baseModel}`)
            return 'checkpoints'
        })(),
        save_path: 'default' as KnownModel_SavePath,
    }))
    const mi: ModelInfo = {
        description: version.description,
        name: version.name as any,
        filename: file.name,
        reference: version.downloadUrl,
        base: uist.base,
        save_path: 'default',
        type: uist.type,
        url: apiKey ? `${file.downloadUrl}${file.downloadUrl.includes('?') ? '&' : '?'}token=${apiKey}` : file.downloadUrl,
    }
    const isBeeingInstalled = cushy.mainHost.manager.modelsBeeingInstalled.has(mi.name as any)
    return (
        <div tw='bd1'>
            <div // File name
                tw='flex items-center gap-1'
            >
                <span className='material-symbols-outlined'>insert_drive_file</span>
                <div tw='font-bold flex items-center'>{file.name}</div>
                <div tw='text-sm underline'>{formatSize(file.sizeKB * 1000)}</div>
                <div tw='flex-1'></div>
                <RevealUI content={() => <JsonViewUI value={file} />}>
                    <div tw='btn btn-xs btn-outline'>
                        <span className='material-symbols-outlined'>info</span>
                        infos
                    </div>
                </RevealUI>
                {file.primary && <div tw='badge badge-primary'>primary</div>}
            </div>
            <div tw='bd1 m-2'>
                <div tw='flex'>
                    <SelectUI // manually override base
                        value={() => uist.base}
                        options={() => knownModel_Base}
                        onChange={(v) => (uist.base = v)}
                        getLabelText={(v) => v}
                    />
                    <SelectUI // manually override type
                        onChange={(v) => (uist.type = v as any)}
                        getLabelText={(v) => v}
                        value={() => uist.type}
                        options={() => knownModel_Type}
                    />
                    <SelectUI // manually override save path info
                        onChange={(v) => (uist.save_path = v as any)}
                        getLabelText={(v) => v}
                        options={() => knownModel_SavePath}
                        value={() => uist.save_path}
                    />
                </div>
                <div tw='flex'>
                    <div // Download button
                        tw={['btn btn-primary btn-sm', isBeeingInstalled && 'btn-disabled']}
                        onClick={() => cushy.mainHost.manager.installModel(mi)}
                    >
                        {isBeeingInstalled && <div tw='loading loading-spinner'></div>}
                        <span className='material-symbols-outlined'>download</span>
                        Download
                    </div>
                    <RevealUI content={() => <JsonViewUI value={mi} />}>
                        <div tw='btn btn-sm btn-link'>show ComfyManager payload</div>
                    </RevealUI>
                </div>
                <div tw='text-sm'>url: {file.downloadUrl}</div>
            </div>
            {/* api key config */}
            {apiKey ? null : <CivitaiWarningAPIKeyMissingUI />}
            {/* debug payload */}
            {/* url */}
            {/* scans */}
            {/* <div tw='text-sm'>{f.scannedAt}</div> */}
            {/* <div tw='text-sm'>pikle scan: {f.pickleScanResult}</div> */}
            {/* <div tw='text-sm'>virus scan: {f.virusScanResult}</div> */}
        </div>
    )
})
