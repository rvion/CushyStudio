import type { EditorView } from '@codemirror/view'

import { syntaxTree } from '@codemirror/language'
import { keymap } from '@codemirror/view'

import { PromptLangNodeName } from '../grammar/grammar.types'
import { $commonAncestor, $smartResolve } from './utils'
import { bang } from 'src/utils/misc/bang'

// https://codemirror.net/docs/ref/#commands.standardKeymap
// see the https://codemirror.net/examples/decoration/

// TODO: allow to increase / decrease weights by scrolling
export const PromptKeymap1 = () =>
    keymap.of([
        { key: 'm-ArrowUp', preventDefault: true, run: changeWeights(0.1, ['WeightedExpression', 'Lora', 'Wildcard']) },
        { key: 'm-ArrowDown', preventDefault: true, run: changeWeights(-0.1, ['WeightedExpression', 'Lora', 'Wildcard']) },
        { key: 'a-ArrowUp', preventDefault: true, run: changeWeights(0.1, ['WeightedExpression', 'Lora', 'Wildcard']) },
        { key: 'a-ArrowDown', preventDefault: true, run: changeWeights(-0.1, ['WeightedExpression', 'Lora', 'Wildcard']) },
        { key: 'm-j', preventDefault: true, run: changeWeights(0.1, ['WeightedExpression', 'Lora', 'Wildcard']) },
        { key: 'm-k', preventDefault: true, run: changeWeights(-0.1, ['WeightedExpression', 'Lora', 'Wildcard']) },
        // { key: 'm-s-j', preventDefault: true, run: changeWeight(0.1, ['Lora', 'Wildcard']) },
        // { key: 'm-s-k', preventDefault: true, run: changeWeight(-0.1, ['Lora', 'Wildcard']) },
        // { key: 'm-s-j', preventDefault: true, run: increaseWeights, },
        // key: 'Alt-ArrowUp',
    ])

const changeWeights =
    (amount: number, stopAt: PromptLangNodeName[]) =>
    (view: EditorView): boolean => {
        // const state: EditorState = view.state
        // const text = view.state.doc.toString()
        // const tree = syntaxTree(view.state)

        const ranges = view.state.selection.ranges
        for (const r of ranges) {
            changeWeight(view, r.from, r.to, amount)
        }
        return true
    }

const formatWeights = (weights: number) => {
    return weights.toFixed(3).replace(/\.?0+$/, '')
}

const changeWeight = (
    //
    view: EditorView,
    from: number,
    to: number,
    amount: number,
) => {
    const tree = syntaxTree(view.state)
    if (from > to) throw new Error(`❌ from > to`)
    const nodeA = $smartResolve(tree, from)
    const nodeB = $smartResolve(tree, to)
    const { a, b } = $commonAncestor(nodeA, nodeB, ['WeightedExpression', 'Lora', 'Wildcard'])

    // increase weights
    if (a === b && a.name === 'WeightedExpression') {
        const number = bang(a.node.lastChild, 'A')
        if ((number.name as PromptLangNodeName) !== 'Number') {
            throw new Error(`❌ Expected a number`)
            return
        }
        const numberTxt = view.state.doc.sliceString(number.from, number.to)
        const oldWeights = parseFloat(numberTxt)
        const newWeights = oldWeights + amount

        // remove weight and ungroup
        if (newWeights === 1) {
            view.dispatch({
                changes: [
                    // remove the `(`
                    { from: a.from, to: a.from + 1, insert: `` },
                    // remove the `)*...`
                    { from: number.from - 2, to: number.to, insert: `` },
                ],
            })
            return
        }

        // update the weights
        view.dispatch({
            changes: [{ from: number.from, to: number.to, insert: formatWeights(newWeights) }],
        })
        return
    }

    // console.log(`[👙] D: a(${a.name}:${a.from}->${a.to}) & b(${b.name}:${b.from}->${b.to})`)
    // group and weights
    const newWeights = formatWeights(1 + amount)
    view.dispatch({
        changes: [
            { from: a.from, to: a.from, insert: `(` },
            { from: b.to, to: b.to, insert: `)*${newWeights}` },
        ],
    })
}
