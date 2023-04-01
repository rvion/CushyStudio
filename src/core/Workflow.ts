// 🔶 It is important for this file not to import anything
// 🔶 Workflow class will be injected in the globalThis context
// 🔶 ritght at the start, so cushy scripts using it can be imported
// 🔶 safely without any dependencies

import type { ComfySetup } from '../global'
import type { ComfyGraph } from './ComfyGraph'

export type WorkflowBuilder = (graph: ComfySetup & ComfyGraph) => void

export class Workflow {
    constructor(public builder: WorkflowBuilder) {}
}
