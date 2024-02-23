import cytoscape from 'cytoscape'
import klay from 'cytoscape-klay'

import { ComfyWorkflowL } from '../models/ComfyWorkflow'
import { ComfyNode } from './ComfyNode'

cytoscape.use(klay)

export class Cyto {
    cy: cytoscape.Core = cytoscape({})

    constructor(public graph: ComfyWorkflowL) {
        this.cy = cytoscape({
            styleEnabled: true,
            headless: true,
        })
        // this.setStyle()
        this.graph.cyto = this
    }

    at: number = 0

    addEdge = (edge: { sourceUID: string; targetUID: string; input: string }) => {
        console.log('🚀 ADD EDGE', edge)
        this.cy.add({
            // style: { 'background-color': 'red' },
            data: {
                position: { x: 100, y: 100 },
                id: `${edge.sourceUID}-${edge.input}->${edge.targetUID}`,
                source: edge.sourceUID,
                target: edge.targetUID,
            },
        })
    }

    removeEdge = (id: string) => {
        console.log('🚀 REMOVE EDGE', id)
        var j = this.cy.getElementById(id)
        console.log('🚀 dbg', j)
        this.cy.remove(j)
    }

    trackNode = (node: ComfyNode<any>) => {
        // this.cy.stop()
        this.at++
        // console.log('🚀 ADD NODE', node.uid, node.$schema.category)
        if (this.cy == null) throw new Error('no cy')
        this.cy
            .add({
                data: {
                    node,
                    id: node.uid,
                    position: { x: 10 * this.at, y: 10 * this.at },
                },
            })
            .addClass('foo')
        for (const edge of node._incomingEdges()) {
            const ctyoEdgeID = `${edge.from}-${edge.inputName}->${node.uid}`
            // console.log('🚀--', ctyoEdgeID)
            this.cy.add({
                // style: { 'background-color': 'red' },
                data: {
                    position: { x: 100, y: 100 },
                    id: ctyoEdgeID,
                    source: edge.from,
                    target: node.uid,
                },
            })
        }
    }

    animate = () => {
        // https://github.com/cytoscape/cytoscape.js-klay
        this.cy
            .layout({
                // @ts-ignore
                fit: true,
                animate: true,
                crossingMinimization: 'INTERACTIVE',
                name: 'klay',
            })
            .start()
        return this.cy.json()
    }

    // setStyle = () => {
    //     this.cy.style([
    //         {
    //             selector: 'node',
    //             style: {
    //                 'background-color': (ele: any) => ele.data('node').color,
    //                 label: 'data(id)',
    //             },
    //         },
    //         {
    //             selector: 'edge',
    //             style: {
    //                 width: 3,
    //                 'line-color': '#ccc',
    //                 'target-arrow-color': '#ccc',
    //                 'target-arrow-shape': 'triangle',
    //                 'curve-style': 'bezier',
    //             },
    //         },
    //     ])
    // }

    // mounted: boolean = false
    // mount = (element: HTMLElement) => {
    //     if (this.mounted) {
    //         this.animate()
    //         return console.log('[፨] cyto already mounted')
    //     }

    //     this.mounted = true
    //     console.log('[፨] MOUNT')
    //     this.cy.mount(element)
    //     this.cy.ready(() => {
    //         console.log('[CYTO] cyto ready')
    //         this.animate()
    //     })
    // }
}
