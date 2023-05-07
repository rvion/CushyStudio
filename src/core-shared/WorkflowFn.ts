import type { LATER } from 'LATER'
import type { Presets } from 'src/presets/presets'
import type { Graph } from './Graph'
import type { Workflow } from './Workflow'

export type WorkflowType = (
    //
    title: string,
    builder: WorkflowBuilderFn,
) => Workflow

export type WorkflowBuilder = {
    //
    graph: LATER<'ComfySetup'> & Graph
    flow: LATER<'FlowRun'>
    presets: Presets
    AUTO: <T>() => T
    stage: 'TODO'
    openpose: 'TODO'
}

export type WorkflowBuilderFn = (p: WorkflowBuilder) => Promise<any>
