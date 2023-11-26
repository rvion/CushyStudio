import type { StepL } from 'src/models/Step'
import { observer } from 'mobx-react-lite'
import { StepOutput_ComfyWorkflow } from 'src/types/MessageFromExtensionToWebview'
import { OutputWrapperUI } from './OutputWrapperUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { useSt } from 'src/state/stateContext'

export const OutputWorkflowUI = observer(function OutputWorkflowUI_(p: { step: StepL; output: StepOutput_ComfyWorkflow }) {
    return (
        <OutputWrapperUI label='Ask'>
            <div>Workflow</div>
        </OutputWrapperUI>
    )
})

export const OutputWorkflowPreviewUI = observer(function OutputWorkflowUI_(p: { step: StepL; output: StepOutput_ComfyWorkflow }) {
    const st = useSt()
    const size = st.outputPreviewSizeStr
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div
                onClick={async () => {
                    const graph = st.db.graphs.get(p.output.graphID)
                    if (graph == null) return // 🔴
                    const litegraphJson = await graph.json_workflow()
                    st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson })
                }}
                style={{ width: size, height: size }}
                tw='bg-blue-800 flex item-center justify-center'
            >
                <span
                    //
                    style={{
                        marginTop: `calc(0.2 * ${size})`,
                        fontSize: `calc(0.6 * ${size})`,
                    }}
                    className='material-symbols-outlined text-blue-400 block'
                >
                    account_tree
                </span>
            </div>
            <OutputWorkflowUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
