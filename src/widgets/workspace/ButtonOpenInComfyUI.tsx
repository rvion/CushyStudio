import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'
import { Button } from '../../rsuite/shims'

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
            <Button
                icon={<span className='material-symbols-outlined'>open_in_new</span>}
                appearance='ghost'
                size='sm'
                onClick={graph.menuAction_openInTab}
            >
                open in ComfyUI Tab
            </Button>
            <Button
                icon={<span className='material-symbols-outlined'>open_in_full</span>}
                appearance='ghost'
                size='sm'
                onClick={graph.menuAction_openInFullScreen}
            >
                open in ComfyUI FULL
            </Button>
        </div>
    )
})
