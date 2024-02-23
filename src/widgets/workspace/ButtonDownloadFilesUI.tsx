import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'
import { Button } from 'src/rsuite/shims'

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
            <Button
                appearance='primary'
                icon={<span className='material-symbols-outlined'>cloud_download</span>}
                size='sm'
                onClick={graph.menuAction_downloadWorkflow}
            >
                Download ComfyUI Workflow
            </Button>
            <Button
                appearance={'ghost'}
                icon={<span className='material-symbols-outlined'>cloud_download</span>}
                size='sm'
                onClick={graph.menuAction_downloadPrompt}
            >
                Download ComfyUI PROMPT
            </Button>
        </div>
    )
})
