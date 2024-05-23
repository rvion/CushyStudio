import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'

import { Button } from '../../rsuite/button/Button'
import { useSt } from '../../state/stateContext'

export const ButtonOpenInComfyUI = observer(function ButtonOpenInComfyUI_(p: { graph: ComfyWorkflowL | ComfyWorkflowID }) {
    let graphOrGraphID = p.graph
    const st = useSt()
    const graph =
        typeof graphOrGraphID === 'string' //
            ? st.db.comfy_workflow.getOrThrow(graphOrGraphID)
            : graphOrGraphID

    return (
        <div tw='flex gap-2 items-center'>
            Open:
            <Button icon='mdiOpenInNew' appearance='ghost' size='sm' onClick={graph.menuAction_openInTab}>
                open in ComfyUI Tab
            </Button>
            <Button icon='mdiFullscreen' appearance='ghost' size='sm' onClick={graph.menuAction_openInFullScreen}>
                open in ComfyUI FULL
            </Button>
        </div>
    )
})
