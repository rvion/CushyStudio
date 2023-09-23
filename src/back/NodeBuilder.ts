import type { Runtime } from './Runtime'
import type { LATER } from 'LATER'

import { ComfyNode } from '../core/Node'
import { nanoid } from 'nanoid'
import { GraphL } from 'src/models/Graph'

export interface NodeBuilder extends LATER<'ComfySetup'> {}

export class NodeBuilder {
    private nameCache = new Map<string, number>()
    constructor(public graph: GraphL) {
        const schema = graph.st.schema
        // TODO: rewrite with a single defineProperties call
        // with propery object being defined on the client
        // to remove all this extra work

        // 🔴 remove this from here
        for (const node of schema.nodes) {
            // console.log(`node: ${node.name}`)
            Object.defineProperty(this, node.nameInCushy, {
                value: (inputs: any) => {
                    const nthForGivenNode = this.nameCache.get(node.nameInCushy) ?? 0
                    const practicalNameWithinGraph = `${node.nameInCushy}_${nthForGivenNode}`
                    this.nameCache.set(node.nameInCushy, nthForGivenNode + 1)

                    return new ComfyNode(graph, practicalNameWithinGraph, {
                        class_type: node.nameInComfy as any,
                        inputs,
                    })
                },
            })
        }
    }
}
