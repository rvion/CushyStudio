import { observer } from 'mobx-react-lite'
import { ComfyPromptL } from 'src/models/ComfyPrompt'
import { StepL } from 'src/models/Step'
import { Button } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { GraphSummaryUI } from '../widgets/workspace/GraphSummaryUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

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
            {graph.done ? null : (
                <Button
                    tw='self-end'
                    size='xs'
                    appearance='ghost'
                    onClick={() => {
                        st.stopCurrentPrompt()
                    }}
                >
                    STOP GENERATING
                </Button>
            )}
            <GraphSummaryUI graph={graph} />
        </div>
    )
})

export const OutputPromptPreviewUI = observer(function OutputPromptPreviewUI_(p: { step?: Maybe<StepL>; output: ComfyPromptL }) {
    const graph = p.output.graph.item
    if (graph == null)
        return (
            <OutputPreviewWrapperUI output={p.output}>
                <div>❌ ERROR</div>
                <OutputPromptUI step={p.step} output={p.output} />
            </OutputPreviewWrapperUI>
        )
    const pgr1 = graph.progressGlobal
    // const pgr2 = graph.graphProgressCurrentNode
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div>
                <div
                    className='radial-progress'
                    style={{
                        // @ts-ignore
                        '--value': pgr1.percent,
                    }}
                    role='progressbar'
                >
                    {pgr1.percent}%
                </div>
            </div>
        </OutputPreviewWrapperUI>
    )
})
