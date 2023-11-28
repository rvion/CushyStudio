import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { Button } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { StepOutput_Prompt } from 'src/types/StepOutput'
import { GraphSummaryUI } from '../widgets/workspace/GraphSummaryUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

export const OutputPromptUI = observer(function OutputPromptUI_(p: {
    //
    step: StepL
    output: StepOutput_Prompt
}) {
    const msg = p.output
    const st = useSt()
    const db = st.db

    const prompt = db.prompts.get(msg.promptID)
    const graph = prompt?.graph.item
    if (graph == null) return <>no graph</>
    // const currNode = graph.currentExecutingNode
    return (
        <div className='flex flex-col gap-1'>
            {/* <div className='flex flex-wrap'>
                {prompt?.images.map((img) => (
                    <ImageUI key={img.id} img={img} />
                ))}
            </div> */}
            {/* {currNode && <ComfyNodeUI node={currNode} />} */}

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

export const OutputPromptPreviewUI = observer(function OutputPromptPreviewUI_(p: { step: StepL; output: StepOutput_Prompt }) {
    const graph = p.step.outputWorkflow.item
    if (graph == null)
        return (
            <OutputPreviewWrapperUI output={p.output}>
                <div>❌ ERROR</div>
                <OutputPromptUI step={p.step} output={p.output} />
            </OutputPreviewWrapperUI>
        )
    const pgr1 = graph.progressGlobal
    console.log('🟢', pgr1)
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
            <OutputPromptUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
