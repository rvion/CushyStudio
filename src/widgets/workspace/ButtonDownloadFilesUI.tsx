import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { Button, Tooltip, Whisper } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'

export const ButtonDownloadFilesUI = observer(function ButtonDownloadFilesUI_(p: { graph: ComfyWorkflowL | GraphID }) {
    let graphOrGraphID = p.graph
    const st = useSt()
    const graph =
        typeof graphOrGraphID === 'string' //
            ? st.db.graphs.getOrThrow(graphOrGraphID)
            : graphOrGraphID

    return (
        <>
            <Whisper placement='auto' speaker={<Tooltip>Download as ComfyUI workflow.json</Tooltip>}>
                <Button
                    appearance='link'
                    icon={<span className='material-symbols-outlined'>account_tree</span>}
                    size='xs'
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
                    {/* download ComfyUI file */}
                </Button>
            </Whisper>
            <Whisper placement='auto' speaker={<Tooltip>Download as ComfyUI prompt</Tooltip>}>
                <Button
                    appearance='link'
                    icon={<span className='material-symbols-outlined'>message</span>}
                    size='xs'
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
                    {/* download ComfyUI file */}
                </Button>
            </Whisper>
        </>
    )
})
