import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'

import { observable, toJS } from 'mobx'

import { ComfyNode } from '../core/ComfyNode'
import { ComfyNodeMetadata } from 'src/types/ComfyNodeID'

export interface ComfyWorkflowBuilder extends ComfySetup {}

export class ComfyWorkflowBuilder {
    // private nameCache = new Map<string, number>()

    constructor(public graph: ComfyWorkflowL) {
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
                    value: (inputs: any, meta?: ComfyNodeMetadata) => {
                        // ⏸️ const nthForGivenNode = this.nameCache.get(node.nameInCushy) ?? 0
                        // ⏸️ const practicalNameWithinGraph = `${node.nameInCushy}_${nthForGivenNode}`
                        // ⏸️ this.nameCache.set(node.nameInCushy, nthForGivenNode + 1)

                        // 1. allocate an id
                        let uidString: string
                        if (meta?.id != null && meta.id !== '') {
                            // console.log(`>>> trying to preserve id: ${meta.id}`)
                            // increment the graph _uiNumber, so if we modify this later
                            // we won't reuse the same uid and have broken conflicts
                            const uidNumber = parseInt(meta.id, 10)
                            if (!isNaN(uidNumber) && uidNumber > this.graph._uidNumber)
                                this.graph._uidNumber = Math.round(uidNumber + 1)
                            uidString = meta.id
                        } else {
                            uidString = (this.graph._uidNumber++).toString()
                        }

                        // 2. instanciate the node
                        return new ComfyNode(
                            //
                            graph,
                            uidString,
                            observable({ class_type: node.nameInComfy as any, inputs }),
                            observable(meta ?? {}),
                        )
                    },
                })
            } catch (e) {
                /* ❌ */ console.log(e)
                /* ❌ */ console.error('impossible to create builder for node')
                /* ❌ */ console.log(`current:`, JSON.stringify(node.nameInComfy), JSON.stringify(node.nameInCushy))
                /* ❌ */ const prev = schema.nodes.find((n) => n.nameInCushy === node.nameInCushy)!
                /* ❌ */ console.log(`prev`, JSON.stringify(prev.nameInComfy), JSON.stringify(prev.nameInCushy))
                throw e
            }
        }
    }
}

export class MissingNode {}
