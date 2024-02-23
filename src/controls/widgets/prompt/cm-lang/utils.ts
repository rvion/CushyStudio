import type { PromptLangNodeName } from '../grammar/grammar.types'
import type { SyntaxNode, Tree } from '@lezer/common'

import { bang } from 'src/utils/misc/bang'

export const $smartResolve = (tree: Tree, at: number): SyntaxNode => {
    const a = tree.resolve(at, -1)
    const b = tree.resolve(at, 1)
    if (a === b) return a

    const depthA = $ancestorsBottomUp(a).length
    const depthB = $ancestorsBottomUp(b).length

    return depthA < depthB ? b : a
}

export const $ancestorsBottomUp = (node: SyntaxNode): SyntaxNode[] => {
    const ancestors = [node]
    const cursor = node.cursor()
    while (cursor.parent()) ancestors.push(cursor.node)
    return ancestors
}

export const $ancestorsTopDown = (node: SyntaxNode): SyntaxNode[] => {
    const ancestors = [node]
    const cursor = node.cursor()
    while (cursor.parent()) ancestors.unshift(cursor.node)
    return ancestors
}

/**
 * this function is super usefull;
 * have to document the exact logic
 * and why it does what it does
 */
export const $commonAncestor = (
    nodeA: SyntaxNode,
    nodeB: SyntaxNode,
    stopAt: PromptLangNodeName[] = [],
): {
    commonAncestor: SyntaxNode
    a: SyntaxNode
    b: SyntaxNode
} => {
    let ancestorsA = $ancestorsTopDown(nodeA)
    let ancestorsB = $ancestorsTopDown(nodeB)
    // console.log(`ancestorsA: ${ancestorsA.map((a) => a.name).join(' -> ')}`)
    // console.log(`ancestorsB: ${ancestorsB.map((a) => a.name).join(' -> ')}`)
    const maxLen = Math.max(ancestorsA.length, ancestorsB.length)
    let commonAncestor: SyntaxNode | undefined = nodeA
    let a: SyntaxNode = bang(ancestorsA[0], `ancestorsA is empty`)
    let b: SyntaxNode = bang(ancestorsB[0], `ancestorsB is empty`)
    for (let x = 0; x < maxLen; x++) {
        a = bang(ancestorsA[x], `ancestorsA[${x}] is null`)
        b = bang(ancestorsB[x], `ancestorsB[${x}] is null`)
        if (a === b) {
            commonAncestor = a
            if (stopAt.includes(a.name as PromptLangNodeName)) break
        } else break
    }
    return { commonAncestor: bang(commonAncestor, 'C'), a, b }
}
