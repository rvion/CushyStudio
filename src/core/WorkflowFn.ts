import type { LATER } from 'src/back/LATER'
import type { Presets } from 'src/presets/presets'
import type { Graph } from './Graph'
import type { Workflow } from './Workflow'
import type { FlowRun } from 'src/back/FlowRun'

export type WorkflowType = (
    //
    title: string,
    builder: WorkflowBuilderFn,
) => Workflow

export type WorkflowBuilder = {
    //
    graph: LATER<'ComfySetup'> & Graph
    flow: FlowRun
    presets: Presets
    AUTO: <T>() => T
    stage: 'TODO'
    openpose: 'TODO'
}

export type WorkflowBuilderFn = (p: WorkflowBuilder) => Promise<any>
