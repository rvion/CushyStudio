import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import { Panel_ComfyUI } from 'src/panels/Panel_ComfyUI'
import { useSt } from 'src/state/stateContext'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { TabUI } from 'src/app/layout/TabUI'
import { GraphPreviewUI } from 'src/widgets/misc/MsgShowHTMLUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'

export const OutputWorkflowPreviewUI = observer(function OutputWorkflowUI_(p: { step?: Maybe<StepL>; output: ComfyWorkflowL }) {
    const st = useSt()
    const size = st.historySizeStr
    return (
        <RevealUI showDelay={0} hideDelay={100}>
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
            <div>
                <GraphPreviewUI graph={p.output} />
            </div>
        </RevealUI>
    )
})

export const OutputWorkflowUI = observer(function OutputWorkflowUI_(p: { step?: Maybe<StepL>; output: ComfyWorkflowL }) {
    const graph = p.output
    return (
        <TabUI tw='w-full h-full'>
            <div>Simple View</div>
            <div tw='w-full h-full'>
                <div tw='text-sm italic opacity-50'>{graph.id}</div>
                <GraphPreviewUI graph={graph} />
            </div>
            <div>ComfyUI</div>
            <Panel_ComfyUI //
                tw='w-full h-full'
                litegraphJson={graph?.json_workflow()}
            />
        </TabUI>
    )
})

// onClick={async () => {
//     const graph = st.db.graphs.get(p.output.graphID)
//     if (graph == null) return // 🔴
//     const litegraphJson = await graph.json_workflow()
//     st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson })
// }}
// <OutputWorkflowUI step={p.step} output={p.output} />
