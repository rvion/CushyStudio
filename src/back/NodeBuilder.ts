import type { GraphL } from 'src/models/Graph'

import { ComfyNode } from '../core/Node'

export interface NodeBuilder extends ComfySetup {}

export class NodeBuilder {
    private nameCache = new Map<string, number>()
    constructor(public graph: GraphL) {
        const schema = graph.st.schema
        // TODO: rewrite with a single defineProperties call
        // with propery object being defined on the client
        // to remove all this extra work

        // console.log('🟢', schema.nodes.length, new Set(schema.nodes).size)
        // console.log('🟢', schema.nodes.length, new Set(schema.nodes.map((i) => i.nameInCushy)).size)
        // console.log('🟢', schema.nodes.length, new Set(schema.nodes.map((i) => i.nameInComfy)).size)

        // 🔴 remove this from here
        for (const node of schema.nodes) {
            // console.log('🦊', JSON.stringify(node.nameInComfy))
            // console.log(`node: ${node.name}`)
            try {
                Object.defineProperty(this, node.nameInCushy, {
                    value: (inputs: any) => {
                        // const nthForGivenNode = this.nameCache.get(node.nameInCushy) ?? 0
                        // const practicalNameWithinGraph = `${node.nameInCushy}_${nthForGivenNode}`
                        // this.nameCache.set(node.nameInCushy, nthForGivenNode + 1)
                        const uidNumber = (this.graph._uidNumber++).toString()
                        return new ComfyNode(graph, uidNumber, {
                            class_type: node.nameInComfy as any,
                            inputs,
                        })
                    },
                })
            } catch (e) {
                /* ❌ */ console.log(e)
                /* ❌ */ console.error('impossible to create builder for node')
                /* ❌ */ console.log(`current:`, JSON.stringify(node.nameInComfy), JSON.stringify(node.nameInCushy))
                /* ❌ */ const prev = schema.nodes.find((n) => n.nameInCushy === node.nameInCushy)!
                /* ❌ */ console.log(`prev`, JSON.stringify(prev.nameInComfy), JSON.stringify(prev.nameInCushy))
            }
        }
    }
}
