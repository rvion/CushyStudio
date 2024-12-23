import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'

import { LegacyProgressLineUI } from '../../csuite/inputs/LegacyProgressLineUI'
import { LegacySurfaceUI } from '../../csuite/inputs/LegacySurfaceUI'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { NodeRefUI } from '../misc/NodeRefUI'
import { JSONHighlightedCodeUI } from '../misc/TypescriptHighlightedCodeUI'
import { ButtonDownloadFilesUI } from './ButtonDownloadFilesUI'
import { ButtonOpenInComfyUI } from './ButtonOpenInComfyUI'

export const GraphSummaryUI = observer(function GraphSummaryUI_(p: { graph: ComfyWorkflowL }) {
   const graph = p.graph
   return (
      <LegacySurfaceUI tw='relative [min-width:2rem]'>
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
                  <RevealUI content={() => <JSONHighlightedCodeUI code={JSON.stringify(n.json, null, 3)} />}>
                     <span>{n.statusEmoji}</span>
                  </RevealUI>
                  <NodeRefUI size={1.1} label={ix.toString()} node={n} />
                  <span tw='overflow-hidden text-ellipsis whitespace-nowrap text-sm'>
                     {n.$schema.nameInComfy}
                  </span>
               </div>
            ))}
         </div>
      </LegacySurfaceUI>
   )
})

export const NodeProgressUI = observer(function NodeProgressUI_(p: { graph: ComfyWorkflowL }) {
   const graph = p.graph
   if (graph == null) return <>no execution yet</>
   const pgr = graph.progressCurrentNode
   return <LegacyProgressLineUI status={pgr?.isDone ? 'success' : 'active'} percent={pgr?.percent} />
})

export const GraphProgressUI = observer(function NodeProgressUI_(p: { graph: ComfyWorkflowL }) {
   const graph = p.graph
   if (graph == null) return null
   const pgr = graph.progressGlobal
   return <LegacyProgressLineUI status={pgr.isDone ? 'success' : 'active'} percent={pgr.percent} />
})
