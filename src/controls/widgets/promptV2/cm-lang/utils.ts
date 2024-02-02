import type { PromptLangNodeName } from '../grammar/grammar.types'
import type { SyntaxNode } from '@lezer/common'
import { bang } from 'src/utils/misc/bang'

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
    if (ancestorsA.length < ancestorsB.length) {
        let _ = ancestorsA
        ancestorsA = ancestorsB
        ancestorsB = _
    }

    let commonAncestor: SyntaxNode | undefined
    let a: SyntaxNode = nodeA
    let b: SyntaxNode = nodeB
    for (a of ancestorsA) {
        b = bang(ancestorsB.shift(), 'B')
        if (a === b) {
            commonAncestor = a
            if (stopAt.includes(a.name as PromptLangNodeName)) break
        } else break
    }
    return { commonAncestor: bang(commonAncestor, 'C'), a, b }
}
