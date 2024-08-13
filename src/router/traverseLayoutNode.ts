import * as FL from 'flexlayout-react'

import { exhaust } from '../csuite/utils/exhaust'

/** undefined means continue */
export type TraversalNextStep = Maybe<'stop'>

export type TraverseFn = {
    // Specific traversals ------------------------------------------
    /** if unspecified, traversal will 'continue' to children */
    onRow?: (row: FL.RowNode) => TraversalNextStep

    /** if unspecified, traversal will 'continue' to children */
    onTabset?: (tabset: FL.TabSetNode) => TraversalNextStep

    /** if unspecified, traversal will 'continue' to children */
    onTab?: (tab: FL.TabNode) => TraversalNextStep

    /** if unspecified, traversal will 'continue' to children */
    onBorder?: (border: FL.BorderNode) => TraversalNextStep

    /** if unspecified, traversal will 'continue' to children */
    onSplitter?: (border: FL.SplitterNode) => TraversalNextStep

    // Generic traversals -------------------------------------------
    /**
     * if provided, will be called for all row/tabset/tab
     * after their dedicated callback if also specified
     */
    onNode1?: (node: FL.Node) => TraversalNextStep
    /**
     * if provided, will be called for all row/tabset/tab
     * after their dedicated callback if also specified
     */
    onNode2?: (nodeWithType: FlexlayoutNodeWithType) => TraversalNextStep
}

export type FlexlayoutNodeWithType =
    | { type: 'row'; node: FL.RowNode }
    | { type: 'tabset'; node: FL.TabSetNode }
    | { type: 'tab'; node: FL.TabNode }
    | { type: 'border'; node: FL.BorderNode }
    | { type: 'splitter'; node: FL.SplitterNode }

export type KnownLayoutNodeType = 'row' | 'tabset' | 'tab' | 'border' | 'splitter'
export const knownLayoutNodeType = ['row', 'tabset', 'tab', 'border', 'splitter']

export function traverseLayoutNode(node: FL.Node, fns: TraverseFn): void {
    const x = _getNodeType(node)
    let next: TraversalNextStep
    if (x.type === 'row') {
        next ??= fns.onRow?.(x.node)
        next ??= fns.onNode1?.(x.node)
        next ??= fns.onNode2?.(x)
    } else if (x.type === 'tabset') {
        next ??= fns.onTabset?.(x.node)
        next ??= fns.onNode1?.(x.node)
        next ??= fns.onNode2?.(x)
    } else if (x.type === 'tab') {
        next ??= fns.onTab?.(x.node)
        next ??= fns.onNode1?.(x.node)
        next ??= fns.onNode2?.(x)
    } else if (x.type === 'border') {
        next ??= fns.onBorder?.(x.node)
        next ??= fns.onNode1?.(x.node)
        next ??= fns.onNode2?.(x)
    } else if (x.type === 'splitter') {
        next ??= fns.onSplitter?.(x.node)
        next ??= fns.onNode1?.(x.node)
        next ??= fns.onNode2?.(x)
    } else {
        exhaust(x)
        throw new Error(`[❌] unknown layout node type: ${(x as any).type}`)
    }
    if (next !== 'stop') {
        const children = node.getChildren()
        for (const child of children) {
            traverseLayoutNode(child, fns)
        }
    }
}

function _getNodeType(node: FL.Node): FlexlayoutNodeWithType {
    const type = node.getType()
    if (type === 'row') return { type: 'row', node: node as FL.RowNode }
    if (type === 'tabset') return { type: 'tabset', node: node as FL.TabSetNode }
    if (type === 'tab') return { type: 'tab', node: node as FL.TabNode }
    if (type === 'border') return { type: 'border', node: node as FL.BorderNode }
    if (type === 'splitter') return { type: 'splitter', node: node as FL.SplitterNode }
    throw new Error(`[❌] unknown layout node type: ${type}`)
}
