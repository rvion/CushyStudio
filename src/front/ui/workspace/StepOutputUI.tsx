import { writeFileSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { Button, Message, Panel } from 'rsuite'
import { StepL, StepOutput } from 'src/models/Step'
import { ComfyNodeUI } from '../NodeListUI'
import { ImageUI } from '../galleries/ImageUI'
import { GraphSummaryUI } from './GraphSummaryUI'
import { CustomNodeFlow } from '../graph/Graph2UI'
import { ReactNode } from 'react'
import { GraphL } from 'src/models/Graph'

export const OutputWrapperUI = observer(function OutputWrapperUI_(p: { label: string; children: ReactNode }) {
    return (
        <Panel className='flex flex-row gap-2 col-info'>
            <div className='flex items-baseline'>
                <div className='font-bold'>{p.label}:</div>
                <div>{p.children}</div>
            </div>
        </Panel>
    )
})
export const StepOutputUI = observer(function StepOutputUI_(p: { step: StepL; output: StepOutput }) {
    const msg = p.output
    const outputGraph = p.step.outputGraph.item
    const db = outputGraph.db

    if (msg.type === 'print') return <OutputWrapperUI label='LOG'>{msg.message}</OutputWrapperUI>
    if (msg.type === 'prompt') {
        const prompt = db.prompts.get(msg.promptID)
        const graph = prompt?.graph.item
        if (graph == null) return <>no graph</>
        const currNode = graph.currentExecutingNode
        return (
            <div className='flex flex-wrap'>
                <div>
                    <GraphSummaryUI graph={graph} />
                    <ButonDownloadFilesUI graph={graph} />
                    {/* 💬 {prompt?.id} */}
                    {/* <div>({prompt?.images.items.length} images)</div> */}
                </div>
                {/* <CustomNodeFlow /> 🔴 */}
                {currNode && <ComfyNodeUI node={currNode} />}
                <div className='flex'>
                    {prompt?.images.map((img) => (
                        <ImageUI key={img.id} img={img} />
                    ))}
                </div>
            </div>
        )
    }

    if (msg.type === 'execution_error') {
        // const prompt = graph.db.prompts.get(msg.data.prompt_id)
        // const graph = prompt?.graph.item
        return (
            <div>
                <ButonDownloadFilesUI graph={outputGraph} />
                <Message type='error' title='An error occured' showIcon>
                    <div>{msg.data.node_type}</div>
                    <div>{msg.data.exception_message}</div>
                    <div>{msg.data.exception_type}</div>
                    <Panel title='Details' collapsible defaultExpanded={false}>
                        <pre>{JSON.stringify(msg.data, null, 3)}</pre>
                    </Panel>
                </Message>
            </div>
        )
    }
    if (msg.type === 'executed') return <div>✅</div>

    return <div className='border'>❌ unhandled message of type `{msg.type}`</div>
})

export const ButonDownloadFilesUI = observer(function ButonDownloadFilesUI_(p: { graph: GraphL }) {
    const { graph } = p
    return (
        <div>
            <Button
                onClick={async () => {
                    const jsonWorkflow = await graph?.json_workflow()
                    console.log('>>>🟢', { jsonWorkflow })
                    const path = graph.getTargetWorkflowFilePath()
                    console.log('>>>🟢', { path })
                    // open file
                    window.require('electron').shell.openExternal(`file://${path}/..`)
                    writeFileSync(path, JSON.stringify(jsonWorkflow, null, 3))
                }}
            >
                download files
            </Button>
        </div>
    )
})
