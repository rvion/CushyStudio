import cytoscape from 'cytoscape'
import type { Graph } from './Graph'
import klay from 'cytoscape-klay'

cytoscape.use(klay)

/** partial type of cytoscape json output
 * include the subset needed to get positions post layout
 */
export type CytoJSON = {
    elements: {
        nodes: {
            data: { id: string }
            position: {
                x: number
                y: number
            }
        }[]
    }
}

export const xxx = async (graph: Graph): Promise<CytoJSON> => {
    // Define the graph elements

    const elements: any[] = []
    for (const node of graph.nodes) {
        elements.push({
            data: {
                id: node.uid,
            },
            style: {
                shape: 'rectangle',
                width: node.width,
                height: node.height,
            },
        })
        for (const edge of node._incomingEdges()) {
            elements.push({
                data: {
                    id: `${edge.from}-${edge.inputName}->${node.uid}`,
                    source: edge.from,
                    target: node.uid,
                },
            })
        }
    }

    // Create a new Cytoscape instance
    const cy = cytoscape({
        headless: true,
        elements: elements,
        // layout: { name: 'grid' },
        styleEnabled: true,
    })

    // Run the layout
    const layout = cy.layout({
        // @ts-ignore
        fit: true,
        animate: true,
        crossingMinimization: 'INTERACTIVE',
        name: 'klay',
        // @ts-ignore
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
