import { ComfyNode } from '../core-shared/Node'
import { Slot } from '../core-shared/Slot'
import { Graph } from '../core-shared/Graph'
import { Workflow } from '../core-shared/Workflow'
import { ComfyNodeSchemaJSON } from '../core-types/ComfySchemaJSON'
import { ComfyNodeUID } from '../core-types/NodeUID'

export type XX = {
    a: Slot<any>
    b: ComfyNodeUID
    c: ComfyNode<any>
    d: ComfyNodeSchemaJSON
    e: Graph
    f: Workflow
}
