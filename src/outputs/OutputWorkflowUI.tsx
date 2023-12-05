import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { ComfyWorkflowL } from 'src/models/Graph'
import { Panel_ComfyUI } from 'src/panels/Panel_ComfyUI'
import { useSt } from 'src/state/stateContext'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

export const OutputWorkflowPreviewUI = observer(function OutputWorkflowUI_(p: { step?: Maybe<StepL>; output: ComfyWorkflowL }) {
    const st = useSt()
    const size = st.historySizeStr
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div style={{ width: size, height: size }} tw='flex item-center justify-center'>
                <span
                    className='material-symbols-outlined text-primary block'
                    style={{
                        marginTop: `calc(0.2 * ${size})`,
                        fontSize: `calc(0.6 * ${size})`,
                    }}
                >
                    account_tree
                </span>
            </div>
        </OutputPreviewWrapperUI>
    )
})

export const OutputWorkflowUI = observer(function OutputWorkflowUI_(p: { step?: Maybe<StepL>; output: ComfyWorkflowL }) {
    const graph = p.output
    return (
        <Panel_ComfyUI //
            tw='w-full h-full'
            litegraphJson={graph?.json_workflow()}
        />
    )
})

// onClick={async () => {
//     const graph = st.db.graphs.get(p.output.graphID)
//     if (graph == null) return // 🔴
//     const litegraphJson = await graph.json_workflow()
//     st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson })
// }}
// <OutputWorkflowUI step={p.step} output={p.output} />
