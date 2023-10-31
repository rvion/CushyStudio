import cytoscape, { Stylesheet } from 'cytoscape'
import type { GraphL } from '../models/Graph'
import klay from 'cytoscape-klay'
import { bang } from '../utils/bang'

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
            }
            position: {
                x: number
                y: number
            }
        }[]
    }
}

export const runAutolayout = async (graph: GraphL): Promise<CytoJSON> => {
    // Define the graph elements

    const elements: any[] = []
    // let uidNumber = 0
    // for (const node of graph.nodes) {
    //     node.uidNumber = uidNumber++ // 🔴 HORRIBLE HACK
    // }

    for (const node of graph.nodes) {
        elements.push({
            data: {
                // shape: 'rectangle',
                label: node.$schema.nameInComfy,
                id: node.uidNumber,
                width: node.width * 1.2,
                height: node.height * 1.2,
                color: node.color,
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
                'background-color': 'data(color)',
                'font-size': 6,
            },
        },
        {
            selector: 'edge',
            style: {
                'font-size': 6,
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                label: 'data(label)',
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
