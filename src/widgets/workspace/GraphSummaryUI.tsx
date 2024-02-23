import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'

import { NodeRefUI } from '../misc/NodeRefUI'
import { JSONHighlightedCodeUI } from '../misc/TypescriptHighlightedCodeUI'
import { ButtonDownloadFilesUI } from './ButtonDownloadFilesUI'
import { ButtonOpenInComfyUI } from './ButtonOpenInComfyUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Panel, Popover, ProgressLine, Whisper } from 'src/rsuite/shims'

export const GraphSummaryUI = observer(function GraphSummaryUI_(p: { graph: ComfyWorkflowL }) {
    const graph = p.graph
    return (
        <Panel tw='relative [min-width:2rem]'>
            <GraphProgressUI graph={p.graph} />
            {p.graph.done ? null : <NodeProgressUI graph={p.graph} />}
            {/* </div> */}
            <div>
                <ButtonDownloadFilesUI graph={graph} />
                <ButtonOpenInComfyUI graph={graph} />
            </div>
            <div className='overflow-auto'>
                {graph.size === 0 && <div>Empty Graph</div>}
                {graph.pendingNodes.length > 0 && <div>+{graph.pendingNodes.length} nodes remaining</div>}
                {graph.nodesByUpdatedAt.map((n, ix) => (
                    <div key={n.uid} className='flex items-center gap-0.5'>
                        {/* {n.status ?? '❓'} */}
                        <RevealUI>
                            <span>{n.statusEmoji}</span>
                            <JSONHighlightedCodeUI code={JSON.stringify(n.json, null, 3)} />
                            {/* <span className='material-symbols-outlined'>info</span> */}
                        </RevealUI>
                        <NodeRefUI size={1.1} label={ix.toString()} node={n} />
                        <span tw='text-sm overflow-hidden whitespace-nowrap text-ellipsis'>{n.$schema.nameInComfy}</span>
                    </div>
                ))}
            </div>
        </Panel>
    )
})

export const NodeProgressUI = observer(function NodeProgressUI_(p: { graph: ComfyWorkflowL }) {
    const graph = p.graph
    if (graph == null) return <>no execution yet</>
    const pgr = graph.progressCurrentNode
    return <ProgressLine status={pgr?.isDone ? 'success' : 'active'} percent={pgr?.percent} />
})

export const GraphProgressUI = observer(function NodeProgressUI_(p: { graph: ComfyWorkflowL }) {
    const graph = p.graph
    if (graph == null) return null
    const pgr = graph.progressGlobal
    return <ProgressLine status={pgr.isDone ? 'success' : 'active'} percent={pgr.percent} />
})
