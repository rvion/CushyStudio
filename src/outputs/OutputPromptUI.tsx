import { observer } from 'mobx-react-lite'
import { ComfyPromptL } from 'src/models/ComfyPrompt'
import { StepL } from 'src/models/Step'
import { Button } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { GraphSummaryUI } from '../widgets/workspace/GraphSummaryUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'

export const OutputPromptPreviewUI = observer(function OutputPromptPreviewUI_(p: { step?: Maybe<StepL>; output: ComfyPromptL }) {
    const st = useSt()
    const graph = p.output.graph.item
    const size = st.gallerySizeStr
    if (graph == null)
        return (
            <OutputPreviewWrapperUI output={p.output}>
                <div>❌ ERROR</div>
                {/* <OutputPromptUI step={p.step} output={p.output} /> */}
            </OutputPreviewWrapperUI>
        )

    const pgr1 = graph.progressGlobal
    // const pgr2 = graph.graphProgressCurrentNode
    return (
        <OutputPreviewWrapperUI output={p.output}>
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
