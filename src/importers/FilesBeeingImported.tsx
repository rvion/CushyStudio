import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import type { FC } from 'react'

import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { getPngMetadataFromFile } from './getPngMetadata'
import { usePromise } from './usePromise'
import { Button, Panel } from 'src/rsuite/shims'
import { useSt } from '../state/stateContext'
import { TypescriptHighlightedCodeUI } from '../widgets/misc/TypescriptHighlightedCodeUI'
import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'

export interface FileListProps {
    files: File[]
}

export const FileBeeingImportedUI: FC<FileListProps> = observer(function FileBeeingImportedUI_({ files }) {
    if (files.length === 0) {
        return null
        // return <div>Nothing to display</div>
    }
    return (
        <div>
            {files.map((file) => (
                <ImportedFileUI key={file.name} file={file} />
            ))}
        </div>
    )
})

// const label = (file: File) => `'${file.name}' of size '${file.size}' and type '${file.type}'`

export const ImportedFileUI = observer(function ImportedFileUI_(p: { file: File }) {
    const file = p.file

    const [code, setCode] = useState<string | null>(null)

    const st = useSt()
    const isPng = file.name.endsWith('.png')
    if (!isPng) return <>not a png</>

    const promise = usePromise(() => getPngMetadataFromFile(file), [])
    const metadata = promise.value

    if (metadata == null) return <>loading...</>
    const workflowStr = (metadata as { [key: string]: any }).workflow

    if (workflowStr == null) return <>❌1. no workflow in metadata</>
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
        return <>❌3. cannot convert LiteGraph To Prompt</>
    }

    // const json = rawJson?.value ? JSON.parse(rawJson.value) : null
    // const hasWorkflow = json?.workflow

    return (
        <Panel tw='bg-base-300' bordered shaded>
            <Field k='name' v={file.name} />
            <Field k='size' v={file.size} />
            <Field k='name' v={file.type} />
            {/* ${file.name}' of size '${file.size}' and type '${file.type}'<div>metadata:</div> */}
            <Field k='metadata' v={metadata} />
            <Field k='workflowJSON' v={workflowJSON} />
            {/* <div>workfow:</div> */}
            {/* <pre>{JSON.stringify(workflowJSON)}</pre> */}
            <Button
                appearance='primary'
                onClick={async () => {
                    //
                    const x = st.importer.convertPromptToCode(promptJSON, {
                        title: 'file.name',
                        author: 'test',
                        preserveId: true,
                        autoUI: true,
                    })
                    setCode(x)
                }}
            >
                Importer
            </Button>
            {code && <TypescriptHighlightedCodeUI code={code} />}
            {/* {json ? <pre>{JSON.stringify(json.value, null, 4)}</pre> : null} */}
            {/* {Boolean(hasWorkflow) ? '🟢 has workflow' : `🔴 no workflow`} */}
        </Panel>
    )
})

const Field = observer(function Field_(p: { k: string; v: string | number | object }) {
    return (
        <div className='flex items-start gap-1'>
            <div className='text-neutral-content italic'>{p.k}:</div>
            <div>{typeof p.v === 'object' ? <pre>{JSON.stringify(p.v)}</pre> : p.v}</div>
        </div>
    )
})
