import type { StepL, StepOutput } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { Message, Panel } from 'rsuite'
import { exhaust } from '../../../utils/ComfyUtils'
import { ComfyNodeUI } from '../NodeListUI'
import { ImageUI } from '../galleries/ImageUI'
import { ButtonDownloadFilesUI } from './ButtonDownloadFilesUI'
import { GraphSummaryUI } from './GraphSummaryUI'

export const OutputWrapperUI = observer(function OutputWrapperUI_(p: { label: string; children: ReactNode }) {
    return (
        <Panel className='flex flex-rowcol-info'>
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

    if (msg.type === 'print') {
        return (
            <OutputWrapperUI label='💬'>
                <div className=''>{msg.message}</div>
            </OutputWrapperUI>
        )
    }

    if (msg.type === 'prompt') {
        const prompt = db.prompts.get(msg.promptID)
        const graph = prompt?.graph.item
        if (graph == null) return <>no graph</>
        const currNode = graph.currentExecutingNode
        return (
            <div className='flex flex-col gap-1'>
                <div>
                    <GraphSummaryUI graph={graph} />
                    {/* 💬 {prompt?.id} */}
                    {/* <div>({prompt?.images.items.length} images)</div> */}
                </div>
                {/* <CustomNodeFlow /> 🔴 */}
                {currNode && <ComfyNodeUI node={currNode} />}
                <Panel>
                    <div className='flex flex-wrap'>{prompt?.images.map((img) => <ImageUI key={img.id} img={img} />)}</div>
                </Panel>
            </div>
        )
    }

    if (msg.type === 'execution_error') {
        // const prompt = graph.db.prompts.get(msg.data.prompt_id)
        // const graph = prompt?.graph.item
        return (
            <div>
                <ButtonDownloadFilesUI graph={outputGraph} />
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
    if (msg.type === 'runtimeError')
        return (
            <Panel>
                <div>❌ Execution Error</div>
                <div>{msg.message}</div>
                <pre>{JSON.stringify(msg.infos, null, 3)}</pre>
                {msg.graphID ? <ButtonDownloadFilesUI graph={msg.graphID} /> : null}
            </Panel>
        )

    if (msg.type === 'show-html')
        return (
            <Panel>
                <div>{msg.title}</div>
                <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
            </Panel>
        )
    exhaust(msg)
    return <div className='border'>❌ unhandled message of type `{(msg as any).type}`</div>
})
