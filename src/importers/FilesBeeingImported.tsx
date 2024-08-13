import type { LiteGraphJSON } from '../core/LiteGraph'
import type { ComfyPromptJSON } from '../types/ComfyPrompt'

import { writeFileSync } from 'fs'
import { keys } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useState } from 'react'

import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'
import { extractErrorMessage } from '../csuite/formatters/extractErrorMessage'
import { Surface } from '../csuite/inputs/shims'
import { MessageInfoUI } from '../csuite/messages/MessageInfoUI'
import { toastError } from '../csuite/utils/toasts'
import { createMediaImage_fromFileObject } from '../models/createMediaImage_fromWebFile'
import { useSt } from '../state/stateContext'
import { getPngMetadataFromFile } from '../utils/png/_getPngMetadata'
import { getWebpMetadata } from '../utils/png/_getWebpMetadata'
import { TypescriptHighlightedCodeUI } from '../widgets/misc/TypescriptHighlightedCodeUI'
import { PromptToCodeOpts } from './ComfyImporter'
import { usePromise } from './usePromise'

export interface FileListProps {
    files: File[]
}

export const ImportAsImageUI = observer(function ImportAsImageUI_(p: { className?: string; file: File }) {
    const st = useSt()
    const file = p.file
    const url = URL.createObjectURL(p.file)
    const uiSt = useLocalObservable(() => ({ validImage: false }))
    return (
        <div tw='flex gap-1'>
            <img
                onLoad={() => {
                    uiSt.validImage = true
                    // URL.revokeObjectURL(url)
                }}
                style={{ width: '5rem', height: '5rem' }}
                src={url}
            />
            <div
                tw={['btn btn-primary btn-sm', uiSt.validImage ? null : 'btn-disabled']}
                onClick={async () => {
                    if (!uiSt.validImage) return
                    await createMediaImage_fromFileObject(file)
                }}
            >
                import as image
            </div>
        </div>
    )
})

export const ImportedFileUI = observer(function ImportedFileUI_(p: {
    //
    className?: string
    file: File
}) {
    const file = p.file
    const [code, setCode] = useState<string | null>(null)
    const [relPath, setRelPath] = useState<string | null>(`library/local/${file.name}-${Date.now()}.ts`)
    const st = useSt()

    const promise = usePromise(() => {
        if (file.name.endsWith('.png')) return getPngMetadataFromFile(file)
        if (file.name.endsWith('.webp')) return getWebpMetadata(file)
        if (file.name.endsWith('.json')) return file.text().then((x) => ({ workflow: x }))
        return Promise.resolve('NO')
    }, [])
    const metadata = promise.value

    if (metadata == null) return <>loading...</>
    if (metadata === 'NO') return <>❌0. no metadata</>

    const workflowStr = (metadata as { [key: string]: any }).workflow

    if (workflowStr == null) return <>❌1. no workflow in metadata (keys: {JSON.stringify(metadata)})</>
    let workflowJSON: LiteGraphJSON
    try {
        workflowJSON = JSON.parse(workflowStr)
    } catch (error) {
        return <>❌2. workflow is not valid json</>
    }

    let promptJSON: ComfyPromptJSON
    try {
        promptJSON = convertLiteGraphToPrompt(st.schema, workflowJSON)
    } catch (error) {
        console.log(error)
        return <>❌3. cannot convert LiteGraph To Prompt {extractErrorMessage(error)}</>
    }

    // const json = rawJson?.value ? JSON.parse(rawJson.value) : null
    // const hasWorkflow = json?.workflow
    const partialImportConfs: {
        title: string
        conf: Partial<PromptToCodeOpts>
    }[] = [
        //
        { title: 'base', conf: { preserveId: false, autoUI: false } },
        { title: 'autoui', conf: { preserveId: false, autoUI: true } },
        { title: 'base+id', conf: { preserveId: true, autoUI: false } },
        { title: 'autoui+id', conf: { preserveId: true, autoUI: true } },
    ]
    return (
        <Surface className={p.className} tw='overflow-auto virtua'>
            <LegacyFieldUI k='name' v={file.name} />
            <LegacyFieldUI k='size' v={file.size} />
            <LegacyFieldUI k='name' v={file.type} />
            {/* ${file.name}' of size '${file.size}' and type '${file.type}'<div>metadata:</div> */}
            <LegacyFieldUI k='metadata' v={metadata} />
            <LegacyFieldUI k='workflowJSON' v={workflowJSON} />
            {/* <div>workfow:</div> */}
            {/* <pre>{JSON.stringify(workflowJSON)}</pre> */}

            <div tw='join'>
                {partialImportConfs.map((conf) => (
                    <div
                        tw='btn btn-sm btn-outline join-item'
                        key={conf.title}
                        onClick={async () => {
                            //
                            const x = st.importer.convertPromptToCode(promptJSON, {
                                title: file.name,
                                author: 'unknown',
                                preserveId: conf.conf.preserveId ?? false,
                                autoUI: conf.conf.autoUI ?? true,
                            })
                            setCode(x)
                        }}
                    >
                        {conf.title}
                    </div>
                ))}
            </div>

            {code && (
                <div tw='bd1 m-2'>
                    <div
                        onClick={async () => {
                            // if (uist.hasConflict) return toastError('file already exist, change app name')
                            const path = `${st.rootPath}/${relPath}`
                            writeFileSync(path, code, 'utf-8')
                            const file = st.library.getFile(relPath as RelativePath)
                            const res = await file.extractScriptFromFile()
                            if (res.type === 'failed') return toastError('failed to extract script')
                            const script = res.script
                            script.evaluateAndUpdateAppsAndViews()
                            const apps = script._apps_viaScript
                            if (apps == null) return toastError('no app found (apps is null)')
                            if (apps.length === 0) return toastError('no app found (apps.length === 0)')
                            const firstApp = apps[0]!
                            firstApp.openLastOrCreateDraft()
                        }}
                        tw='btn btn-sm btn-primary'
                    >
                        create file
                    </div>
                    <MessageInfoUI markdown={` This file will be created as  \`${relPath}\``} />
                    <TypescriptHighlightedCodeUI code={code} />
                </div>
            )}
            {/* {json ? <pre>{JSON.stringify(json.value, null, 4)}</pre> : null} */}
            {/* {Boolean(hasWorkflow) ? '🟢 has workflow' : `🔴 no workflow`} */}
        </Surface>
    )
})

const LegacyFieldUI = observer(function LegacyFieldUI_(p: { k: string; v: string | number | object }) {
    return (
        <div className='flex items-start gap-1'>
            <div className='text-neutral-content italic'>{p.k}:</div>
            <div>{typeof p.v === 'object' ? <pre>{JSON.stringify(p.v)}</pre> : p.v}</div>
        </div>
    )
})
