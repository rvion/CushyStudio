import { observer } from 'mobx-react-lite'
import { IconButton, Tooltip, Whisper } from 'rsuite'
import type { GraphID, GraphL } from 'src/models/Graph'
import { useSt } from '../../FrontStateCtx'

export const ButtonOpenInComfyUI = observer(function ButtonOpenInComfyUI_(p: { graph: GraphL | GraphID }) {
    let graphOrGraphID = p.graph
    const st = useSt()
    const graph =
        typeof graphOrGraphID === 'string' //
            ? st.db.graphs.getOrThrow(graphOrGraphID)
            : graphOrGraphID

    return (
        <Whisper speaker={<Tooltip>Open in ComfyUI</Tooltip>}>
            <IconButton
                icon={<span className='material-symbols-outlined'>open_in_new</span>}
                appearance='link'
                size='xs'
                onClick={async () => {
                    const prompt = await graph?.json_workflow()
                    if (prompt == null) return
                    st.setAction({ type: 'comfy', json: prompt })
                    // console.log('>>>🟢', { jsonWorkflow })
                    // const path = graph.getTargetWorkflowFilePath()
                    // console.log('>>>🟢', { path })
                    // // open file
                    // window.require('electron').shell.openExternal(`file://${path}/..`)
                    // writeFileSync(path, JSON.stringify(jsonWorkflow, null, 3))
                }}
            ></IconButton>
        </Whisper>
    )
})
