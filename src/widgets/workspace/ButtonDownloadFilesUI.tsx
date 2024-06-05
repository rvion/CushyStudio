import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { useSt } from '../../state/stateContext'

export const ButtonDownloadFilesUI = observer(function ButtonDownloadFilesUI_(p: {
    //
    graph: ComfyWorkflowL | ComfyWorkflowID
}) {
    let graphOrGraphID = p.graph
    const st = useSt()
    const graph =
        typeof graphOrGraphID === 'string' //
            ? st.db.comfy_workflow.getOrThrow(graphOrGraphID)
            : graphOrGraphID

    return (
        <div tw='flex gap-2 items-center'>
            <Button look='primary' icon='mdiCloudDownload' size='sm' onClick={graph.menuAction_downloadWorkflow}>
                Download ComfyUI Workflow
            </Button>
            <Button look='ghost' icon='mdiCloudDownload' size='sm' onClick={graph.menuAction_downloadPrompt}>
                Download ComfyUI PROMPT
            </Button>
        </div>
    )
})
