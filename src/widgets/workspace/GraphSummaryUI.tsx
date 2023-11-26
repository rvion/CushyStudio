import type { GraphL } from 'src/models/Graph'

import { observer } from 'mobx-react-lite'
import { Panel, Popover, ProgressLine, Whisper } from 'src/rsuite/shims'
import { NodeRefUI } from '../misc/NodeRefUI'
import { JSONHighlightedCodeUI } from '../misc/TypescriptHighlightedCodeUI'
import { ButtonDownloadFilesUI } from './ButtonDownloadFilesUI'
import { ButtonOpenInComfyUI } from './ButtonOpenInComfyUI'

export const GraphSummaryUI = observer(function GraphSummaryUI_(p: { graph: GraphL }) {
    const graph = p.graph
    return (
        <Panel tw='relative [min-width:2rem]'>
            {/* <div */}
            {/* // */}
            {/* // style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} */}
            {/* > */}
            <GraphProgressUI graph={p.graph} />
            <NodeProgressUI graph={p.graph} />
            {/* </div> */}
            <div>
                <ButtonDownloadFilesUI graph={graph} />
                <ButtonOpenInComfyUI graph={graph} />
            </div>
            <div className='max-h-48 overflow-auto'>
                {graph.size === 0 && <div>Empty Graph</div>}
                {graph.pendingNodes.length > 0 && <div>+{graph.pendingNodes.length} nodes remaining</div>}
                {graph.nodesByUpdatedAt.map((n, ix) => (
                    <div key={n.uid} className='flex items-center gap-0.5'>
                        {/* {n.status ?? '❓'} */}
                        <Whisper
                            enterable
                            placement='auto'
                            speaker={
                                <Popover>
                                    <JSONHighlightedCodeUI code={JSON.stringify(n.json, null, 3)} />
                                </Popover>
                            }
                        >
                            <span>{n.statusEmoji}</span>
                            {/* <span className='material-symbols-outlined'>info</span> */}
                        </Whisper>
                        <NodeRefUI size={1.1} label={ix.toString()} node={n} />
                        <span tw='text-sm overflow-hidden whitespace-nowrap text-ellipsis'>{n.$schema.nameInComfy}</span>
                    </div>
                ))}
            </div>
        </Panel>
    )
})

export const NodeProgressUI = observer(function NodeProgressUI_(p: { graph: GraphL }) {
    const graph = p.graph
    if (graph == null) return <>no execution yet</>
    const pgr = graph.progressCurrentNode
    return <ProgressLine status={pgr?.isDone ? 'success' : 'active'} percent={pgr?.percent} />
})

export const GraphProgressUI = observer(function NodeProgressUI_(p: { graph: GraphL }) {
    const graph = p.graph
    if (graph == null) return null
    const pgr = graph.progressGlobal
    return <ProgressLine status={pgr.isDone ? 'success' : 'active'} percent={pgr.percent} />
})
