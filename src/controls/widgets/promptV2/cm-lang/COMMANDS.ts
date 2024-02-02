import type { EditorState } from '@codemirror/state'
import type { StateEffect } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'

import { syntaxTree } from '@codemirror/language'
import { keymap } from '@codemirror/view'
import { $commonAncestor } from './utils'
import { bang } from 'src/utils/misc/bang'
import { PromptLangNodeName } from '../grammar/grammar.types'
// https://codemirror.net/docs/ref/#commands.standardKeymap
// see the https://codemirror.net/examples/decoration/

export const PromptKeymap1 = () =>
    keymap.of([
        // { key: 'm-s-j', preventDefault: true, run: increaseWeights, },
        // key: 'Alt-ArrowUp',
        { key: 'm-j', preventDefault: true, run: changeWeight(0.1, ['WeightedExpression', 'Lora', 'Wildcards']) },
        { key: 'm-k', preventDefault: true, run: changeWeight(-0.1, ['WeightedExpression', 'Lora', 'Wildcards']) },
        // { key: 'm-s-j', preventDefault: true, run: changeWeight(0.1, ['Lora', 'Wildcards']) },
        // { key: 'm-s-k', preventDefault: true, run: changeWeight(-0.1, ['Lora', 'Wildcards']) },
    ])

const changeWeight =
    (amount: number, stopAt: PromptLangNodeName[]) =>
    (view: EditorView): boolean => {
        // const state: EditorState = view.state
        // const text = view.state.doc.toString()
        const tree = syntaxTree(view.state)

        const ranges = view.state.selection.ranges
        for (const r of ranges) {
            changeWeightXX(view, r.from, r.to, amount)
        }
        return true
    }

const changeWeightXX = (
    //
    view: EditorView,
    from: number,
    to: number,
    amount: number,
) => {
    const tree = syntaxTree(view.state)

    console.log(`[👙] -------------------`)
    const nodeA = tree.resolve(from, 1)
    const nodeB = tree.resolve(to, -1)
    const { a, b } = $commonAncestor(nodeA, nodeB, ['WeightedExpression', 'Lora', 'Wildcards'])
    console.log(`[👙] `, a === b, a.name, b.name)

    // increase weights
    if (a === b && a.name === 'WeightedExpression') {
        const number = bang(a.node.lastChild, 'A')
        if ((number.name as PromptLangNodeName) !== 'Number') {
            throw new Error(`❌ Expected a number`)
            return
        }
        const numberTxt = view.state.doc.sliceString(number.from, number.to)
        const float = parseFloat(numberTxt)
        const float2 = float + amount
        console.log(`[👙] `, number.name, number.from, number.to)
        view.dispatch({ changes: [{ from: number.from, to: number.to, insert: float2.toFixed(2) }] })
        return
    }
    // group and weights
    view.dispatch({
        changes: [
            { from: a.from, to: a.from, insert: `(` },
            { from: b.to, to: b.to, insert: `)x1.1` },
        ],
    })
}

// export function increaseWeightsV2(view: EditorView) {}
// export function increaseWeights(view: EditorView) {
//     // const state: EditorState = view.state
//     // const text = view.state.doc.toString()
//     const tree = syntaxTree(view.state)

//     const ranges = view.state.selection.ranges
//     for (const r of ranges) {
//         console.log(`[👙] -------------------`)
//         const nodeA = tree.resolve(r.from, 1)
//         const nodeB = tree.resolve(r.to, -1)
//         const { a, b } = $commonAncestor(nodeA, nodeB, ['Lora', 'Wildcards'])
//         view.dispatch({
//             changes: [
//                 { from: a.from, to: a.from, insert: `(` },
//                 { from: b.to, to: b.to, insert: `)` },
//             ],
//         })
//     }
//     return true
// }
