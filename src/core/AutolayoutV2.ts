import type { ComfyWorkflowL } from '../models/ComfyWorkflow'

import cytoscape, { Stylesheet } from 'cytoscape'
import klay from 'cytoscape-klay'

import { bang } from '../utils/misc/bang'
import { ComfyNode } from './ComfyNode'

cytoscape.use(klay)

/** partial type of cytoscape json output
 * include the subset needed to get positions post layout
 */
export type CytoJSON = {
    elements: {
        nodes: {
            data: {
                id: string
                width: number
                height: number
                originalID: string
            }
            position: {
                x: number
                y: number
            }
        }[]
    }
}

export const runAutolayout = (
    //
    graph: ComfyWorkflowL,
    p?: {
        width?: (node: ComfyNode<any, any>) => number
        height?: (node: ComfyNode<any, any>) => number
    },
): CytoJSON => {
    // Define the graph elements

    const elements: any[] = []
    // let uidNumber = 0
    // for (const node of graph.nodes) {
    //     node.uidNumber = uidNumber++ // 🔴 HORRIBLE HACK
    // }
    console.log(`[👙] runAutoLayout with ${graph.nodes.length} nodes`)
    for (const node of graph.nodes) {
        elements.push({
            data: {
                // shape: 'rectangle',
                label: node.$schema.nameInComfy,
                id: node.uidNumber,
                width: p?.width?.(node) ?? node.width * 1.2,
                height: p?.height?.(node) ?? node.height * 1.2,
                // @ts-ignore
                originalID: node.uid,
                // color: node.color ?? 'gray',
            },
        })
        for (const edge of node._incomingEdges()) {
            const from = bang(graph.nodes.find((n) => n.uid === edge.from)?.uidNumber)
            const to = node.uidNumber
            const data = {
                label: edge.inputName,
                id: `${from}-${edge.inputName}->${to}`,
                source: from,
                target: to,
            }
            elements.push({ data })
        }
    }

    // Create a new Cytoscape instance
    const stylesheet: Stylesheet[] = [
        {
            selector: 'node',
            style: {
                label: 'data(label)',
                shape: 'rectangle',
                width: 'data(width)',
                height: 'data(height)',
                // 'background-color': 'data(color)',
                'font-size': 6,
            },
        },
        {
            selector: 'edge',
            style: {
                'font-size': 6,
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                // label: 'data(label)',
                // width: 'data(weight)',
            },
        },
    ]
    const cy = cytoscape({
        headless: true,
        elements: elements,
        style: stylesheet,
        // layout: { name: 'grid' },
        styleEnabled: true,
    })

    // Run the layout
    const layout = cy.layout({
        // @ts-ignore
        fit: true,
        // animate: true,
        crossingMinimization: 'INTERACTIVE',
        name: 'klay',
        animate: false,
    })
    layout.run()
    // cy.layout

    // layout.on('', () => {
    //     console.log('🚀 layout ready.')
    //     layout.stop()
    // })
    // console.log('🚀 waiting...')
    // Wait for the layout to finish
    // await layout.promiseOn('layoutstop')
    // console.log('🚀 layout ready.')

    // Export the layout as JSON
    const layoutJSON = cy.json()
    // console.log(layoutJSON)

    // Save the layout as a JSON file
    // const fs = require('fs')
    return layoutJSON as any
    // fs.writeFileSync('output.json', JSON.stringify(layoutJSON, null, 2), 'utf8')
}
