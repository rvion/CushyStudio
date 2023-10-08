import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import type { FC } from 'react'

import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { getPngMetadataFromFile } from './getPngMetadata'
import { usePromise } from './usePromise'
import { Button, Panel } from 'rsuite'
import { useSt } from '../front/FrontStateCtx'
import { TypescriptHighlightedCodeUI } from '../front/ui/TypescriptHighlightedCodeUI'
import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'

export interface FileListProps {
    files: File[]
}

export const FileList: FC<FileListProps> = ({ files }) => {
    if (files.length === 0) {
        return <div>Nothing to display</div>
    }
    const fileList = useMemo(() => list(files), [files])
    return <div>{fileList}</div>
}

const label = (file: File) => `'${file.name}' of size '${file.size}' and type '${file.type}'`

function list(files: File[]) {
    return files.map((file) => (
        <li key={file.name}>
            {/*  */}
            <ImportedFileUI file={file} />
            {/* {label(file)} */}
        </li>
    ))
}

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
        <Panel className='m-2'>
            <div className='text-gray-400 text-xs italic'>{label(file)}</div>
            <div>metadata:</div>
            <pre>{JSON.stringify(metadata)}</pre>
            <div>workfow:</div>
            <pre>{JSON.stringify(workflowJSON)}</pre>
            <Button
                appearance='primary'
                onClick={async () => {
                    //
                    const x = st.importer.convertPromptToCode(promptJSON, {
                        title: 'file.name',
                        author: 'test',
                        preserveId: false,
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
