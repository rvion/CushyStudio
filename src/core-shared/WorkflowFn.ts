import type { LATER } from 'LATER'
import type { Graph } from './Graph'
import type { Workflow } from './Workflow'
import type { Presets } from 'src/core-back/presets'

export type WorkflowType = (
    //
    title: string,
    builder: WorkflowBuilderFn,
) => Workflow

export type WorkflowBuilderFn = (p: {
    //
    graph: LATER<'ComfySetup'> & Graph
    flow: LATER<'FlowRun'>
    presets: Presets
}) => Promise<any>
