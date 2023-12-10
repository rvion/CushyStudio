import { observer } from 'mobx-react-lite'
import { ComfyPromptL } from 'src/models/ComfyPrompt'
import { StepL } from 'src/models/Step'
import { Button } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { GraphSummaryUI } from '../widgets/workspace/GraphSummaryUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { ProgressReport } from 'src/models/Graph'

export const OutputPromptPreviewUI = observer(function OutputPromptPreviewUI_(p: { step?: Maybe<StepL>; output: ComfyPromptL }) {
    const st = useSt()
    const prompt = p.output
    const graph = prompt.graph.item
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
            <div tw='bg-blue-500 '>
                <div
                    className='radial-progress'
                    style={{
                        // width: '100%',
                        // height: '100%',
                        // @ts-ignore
                        '--value': pgr1.percent,
                        '--size': size,
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
    const graph = prompt.graph.item
    if (graph == null) return <>no graph</>
    return (
        <div className='flex flex-col gap-1'>
            <div
                tw='btn btn-sm'
                onClick={() => {
                    st.stopCurrentPrompt()
                }}
            >
                STOP GENERATING
            </div>
            {/* {prompt.status !== 'Running' ? null : (
                <div
                    tw='btn btn-sm'
                    onClick={() => {
                        st.stopCurrentPrompt()
                    }}
                >
                    STOP GENERATING
                </div>
            )} */}
            <GraphSummaryUI graph={graph} />
        </div>
    )
})
