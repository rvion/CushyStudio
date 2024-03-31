import { observer } from 'mobx-react-lite'

import { GraphSummaryUI } from '../widgets/workspace/GraphSummaryUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { ComfyPromptL } from '../models/ComfyPrompt'
import { ProgressReport } from '../models/ComfyWorkflow'
import { StepL } from '../models/Step'
import { useSt } from '../state/stateContext'
import { parseFloatNoRoundingErr } from '../utils/misc/parseFloatNoRoundingErr'

export const OutputPromptPreviewUI = observer(function OutputPromptPreviewUI_(p: { step?: Maybe<StepL>; output: ComfyPromptL }) {
    const st = useSt()
    const prompt = p.output
    const graph = prompt.graph
    const size = st.historySizeStr
    if (graph == null)
        return (
            <OutputPreviewWrapperUI output={prompt}>
                <div>❌ ERROR</div>
                {/* <OutputPromptUI step={p.step} output={prompt} /> */}
            </OutputPreviewWrapperUI>
        )

    const pgr1: ProgressReport = prompt.progressGlobal
    // const pgr2 = graph.graphProgressCurrentNode
    return (
        <OutputPreviewWrapperUI output={prompt}>
            <div tw='flex items-center justify-center p-0 h-full w-full text-shadow text-sm'>
                <div
                    className='radial-progress'
                    style={{
                        // @ts-ignore
                        '--value': pgr1.percent,
                        '--size': `${parseInt(size) * 0.9}px`,
                    }}
                    role='progressbar'
                >
                    {parseFloatNoRoundingErr(pgr1.percent, 0)}%
                </div>
            </div>
        </OutputPreviewWrapperUI>
    )
})

export const OutputPromptUI = observer(function OutputPromptUI_(p: {
    //
    step?: Maybe<StepL>
    output: ComfyPromptL
}) {
    const prompt = p.output
    const st = useSt()
    const graph = prompt.graph
    if (graph == null) return <>no graph</>
    return (
        <div className='flex flex-col gap-1'>
            <div tw='btn btn-sm btn-outline' onClick={() => st.stopCurrentPrompt()}>
                STOP GENERATING
            </div>
            <GraphSummaryUI graph={graph} />
        </div>
    )
})
