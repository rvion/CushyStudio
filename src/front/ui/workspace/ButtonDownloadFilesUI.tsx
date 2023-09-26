import type { GraphID, GraphL } from 'src/models/Graph'

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { useSt } from '../../FrontStateCtx'

export const ButtonDownloadFilesUI = observer(function ButtonDownloadFilesUI_(p: { graph: GraphL | GraphID }) {
    let graphOrGraphID = p.graph
    const st = useSt()
    const graph =
        typeof graphOrGraphID === 'string' //
            ? st.db.graphs.getOrThrow(graphOrGraphID)
            : graphOrGraphID

    return (
        <div>
            <Button
                appearance='link'
                size='xs'
                onClick={async () => {
                    const jsonWorkflow = await graph?.json_workflow()
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
                download ComfyUI file
            </Button>
        </div>
    )
})
