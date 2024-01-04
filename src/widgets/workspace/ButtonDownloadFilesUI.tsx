import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { Button, Tooltip, Whisper } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'

export const ButtonDownloadFilesUI = observer(function ButtonDownloadFilesUI_(p: {
    //
    graph: ComfyWorkflowL | GraphID
}) {
    let graphOrGraphID = p.graph
    const st = useSt()
    const graph =
        typeof graphOrGraphID === 'string' //
            ? st.db.graphs.getOrThrow(graphOrGraphID)
            : graphOrGraphID

    return (
        <div tw='flex gap-2 items-center'>
            Download:{' '}
            <Button
                appearance='primary'
                icon={<span className='material-symbols-outlined'>cloud_download</span>}
                size='sm'
                onClick={async (ev) => {
                    ev.preventDefault()
                    ev.preventDefault()
                    const jsonWorkflow = await graph.json_workflow()
                    console.log('>>>🟢', { jsonWorkflow })
                    // ensure folder exists
                    const folderExists = existsSync(graph.cacheFolder)
                    if (!folderExists) mkdirSync(graph.cacheFolder, { recursive: true })
                    // save file
                    const path = graph.getTargetWorkflowFilePath()
                    console.log('>>>🟢', { path })
                    // open folder containing file
                    window.require('electron').shell.openExternal(`file://${path}/..`)
                    writeFileSync(path, JSON.stringify(jsonWorkflow, null, 3))
                }}
            >
                ComfyUI Workflow
            </Button>
            <Button
                appearance={'ghost'}
                icon={<span className='material-symbols-outlined'>cloud_download</span>}
                size='sm'
                onClick={async (ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    const jsonPrompt = graph.json_forPrompt('use_class_name_and_number')
                    // console.log('>>>🟢', { jsonPrompt })
                    // ensure folder exists
                    const folderExists = existsSync(graph.cacheFolder)
                    if (!folderExists) mkdirSync(graph.cacheFolder, { recursive: true })
                    // save file
                    const path = graph.getTargetPromptFilePath()
                    // console.log('>>>🟢', { path })
                    // open folder containing file
                    window.require('electron').shell.openExternal(`file://${path}/..`)
                    writeFileSync(path, JSON.stringify(jsonPrompt, null, 3))
                }}
            >
                ComfyUI PROMPT
            </Button>
        </div>
    )
})
