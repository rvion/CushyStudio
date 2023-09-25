import type { GraphID, GraphL } from 'src/models/Graph'
import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { useSt } from '../../FrontStateCtx'

export const ButtonOpenInComfyUI = observer(function ButtonOpenInComfyUI_(p: { graph: GraphL | GraphID }) {
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
            >
                Open in ComfyUI
            </Button>
        </div>
    )
})
