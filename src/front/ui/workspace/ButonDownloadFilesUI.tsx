import type { GraphID, GraphL } from 'src/models/Graph'

import { writeFileSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { useSt } from '../../../front/FrontStateCtx'

export const ButonDownloadFilesUI = observer(function ButonDownloadFilesUI_(p: { graph: GraphL | GraphID }) {
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
                    const path = graph.getTargetWorkflowFilePath()
                    console.log('>>>🟢', { path })
                    // open file
                    window.require('electron').shell.openExternal(`file://${path}/..`)
                    writeFileSync(path, JSON.stringify(jsonWorkflow, null, 3))
                }}
            >
                download ComfyUI file
            </Button>
        </div>
    )
})
