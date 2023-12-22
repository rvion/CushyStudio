import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import { observer } from 'mobx-react-lite'
import { Button, Tooltip, Whisper } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'

export const ButtonOpenInComfyUI = observer(function ButtonOpenInComfyUI_(p: { graph: ComfyWorkflowL | GraphID }) {
    let graphOrGraphID = p.graph
    const st = useSt()
    const graph =
        typeof graphOrGraphID === 'string' //
            ? st.db.graphs.getOrThrow(graphOrGraphID)
            : graphOrGraphID

    return (
        <Whisper
            //
            enterable
            placement='autoVerticalEnd'
            speaker={<Tooltip>Open in ComfyUI</Tooltip>}
        >
            <Button
                icon={<span className='material-symbols-outlined'>open_in_new</span>}
                appearance='link'
                size='xs'
                onClick={async (ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    const prompt = graph?.json_workflow()
                    if (prompt == null) return
                    st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson: prompt })
                    // st.setAction({ type: 'comfy', json: prompt })
                    // console.log('>>>🟢', { jsonWorkflow })
                    // const path = graph.getTargetWorkflowFilePath()
                    // console.log('>>>🟢', { path })
                    // // open file
                    // window.require('electron').shell.openExternal(`file://${path}/..`)
                    // writeFileSync(path, JSON.stringify(jsonWorkflow, null, 3))
                }}
            ></Button>
        </Whisper>
    )
})
