import type { PromptLangNodeName } from '../grammar/grammar.types'
import type { ChangeSet, ChangeSpec, Extension } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import type { SyntaxNode } from '@lezer/common'

import { syntaxTree } from '@codemirror/language'
import { keymap } from '@codemirror/view'

import { bang } from '../../csuite/utils/bang'
import { $commonAncestor, $smartResolve } from './utils'

// https://codemirror.net/docs/ref/#commands.standardKeymap
// see the https://codemirror.net/examples/decoration/

// TODO: allow to increase / decrease weights by scrolling
export const PromptKeymap1 = (): Extension =>
   keymap.of([
      {
         key: 'm-ArrowUp',
         preventDefault: true,
         run: changeWeights(0.1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'm-ArrowDown',
         preventDefault: true,
         run: changeWeights(-0.1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'a-ArrowUp',
         preventDefault: true,
         run: changeWeights(0.1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'a-ArrowDown',
         preventDefault: true,
         run: changeWeights(-0.1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'm-j',
         preventDefault: true,
         run: changeWeights(0.1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'm-k',
         preventDefault: true,
         run: changeWeights(-0.1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'shift-a-ArrowUp',
         preventDefault: true,
         run: expandWeights(0, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'shift-a-ArrowLeft',
         preventDefault: true,
         run: expandWeights(-1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'ctrl-a-ArrowRight',
         preventDefault: true,
         run: expandWeights(1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'shift-a-ArrowDown',
         preventDefault: true,
         run: contractWeights(0, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'ctrl-a-ArrowLeft',
         preventDefault: true,
         run: contractWeights(-1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'shift-a-ArrowRight',
         preventDefault: true,
         run: contractWeights(1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'ctrl-shift-a-ArrowLeft',
         preventDefault: true,
         run: shiftWeights(-1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
      {
         key: 'ctrl-shift-a-ArrowRight',
         preventDefault: true,
         run: shiftWeights(1, ['WeightedExpression', 'Lora', 'Wildcard']),
      },
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

const formatWeights = (weights: number): string => {
   return weights.toFixed(3).replace(/\.?0+$/, '')
}

const changeWeight = (
   //
   view: EditorView,
   from: number,
   to: number,
   amount: number,
): void => {
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
               // remove the `:VALUE)`
               { from: number.from - 1, to: number.to + 1, insert: `` },
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

   // console.log(`[🧐] D: a(${a.name}:${a.from}->${a.to}) & b(${b.name}:${b.from}->${b.to})`)
   // group and weights
   const newWeights = formatWeights(1 + amount)
   view.dispatch({
      changes: [
         { from: a.from, to: a.from, insert: `(` },
         { from: b.to, to: b.to, insert: `:${newWeights})` },
      ],
   })
}

const expandWeights =
   (direction: number, stopAt: PromptLangNodeName[]) =>
   (view: EditorView): boolean => {
      const ranges = view.state.selection.ranges
      const tree = syntaxTree(view.state)

      for (const r of ranges) {
         // TODO(bird_d/prompting/logic): Make this find the first weighted expression inside the selected range and go from there.
         // Do nothing if there is a selection for now
         if (r.from != r.to) {
            continue
         }

         let a: SyntaxNode | null = $smartResolve(tree, r.to)

         // Make sure we have the entire WeightedExpression group selected
         while (a && a.name != 'WeightedExpression') {
            a = a.parent
         }

         // Token was not inside a WeightedExpression, so do nothing
         if (!a) {
            return true
         }

         // Store changes to do at once later on so undo does not get extra steps
         const changes = []

         // Expand to the left
         if (direction != 1) {
            changes.push(growWeight(view, a, false))
         }

         // Expand to the right
         if (direction != -1) {
            changes.push(growWeight(view, a, true))
         }

         // Expand in both ways if not direction
         view.dispatch({
            changes,
         })
         continue
      }
      return true
   }

const growWeight = (view: EditorView, a: SyntaxNode, next: boolean): ChangeSpec => {
   const tree = syntaxTree(view.state)
   let token: SyntaxNode | undefined
   let offset = a.to
   // Find the token to expand the group to
   while (token === undefined) {
      if (a.name == 'WeightedExpression') {
         let sibling = next ? a.nextSibling : a.prevSibling

         while (sibling != null && sibling.name != 'Identifier') {
            sibling = next ? sibling.nextSibling : sibling.prevSibling
         }

         if (sibling == null) {
            return { from: 0, to: 0, insert: '' }
         }
         token = sibling
         break
      }

      // SAFEGUARD
      if (++offset - a.to > 5000) {
         break
      }
   }

   if (!token) {
      return { from: 0, to: 0, insert: '' }
   }
   const text = view.state.doc.sliceString(a.from, token.to)

   const number = bang(a.node.lastChild, 'A')
   if ((number.name as PromptLangNodeName) !== 'Number') {
      throw new Error(`❌ Expected a number`)
   }

   const numberTxt = view.state.doc.sliceString(number.from, number.to)
   const weight = parseFloat(numberTxt)

   // Expand to the right
   if (next) {
      return [
         // Remove weights
         { from: number.from - 1, to: number.to + 1, insert: '' },
         // Add weights back in
         { from: token.to, to: token.to, insert: `:${weight})` },
      ]
   }

   // Expand to the left
   return [
      // Remove '('
      { from: a.from, to: a.from + 1, insert: '' },
      // Insert '(' in front of new place
      { from: token.from, to: token.from, insert: '(' },
   ]
}

const contractWeights =
   (direction: number, stopAt: PromptLangNodeName[]) =>
   (view: EditorView): boolean => {
      const ranges = view.state.selection.ranges
      const tree = syntaxTree(view.state)

      let index = 0
      for (const r of ranges) {
         // TODO(bird_d/prompting/logic): Make this find the first weighted expression inside the selected range and go from there.
         // Do nothing if there is a selection for now
         if (r.from != r.to) {
            index++
            continue
         }

         let a: SyntaxNode | null = $smartResolve(tree, r.to)

         // Make sure we have the entire WeightedExpression group selected
         while (a && a.name != 'WeightedExpression') {
            a = a.parent
         }

         // Token was not inside a WeightedExpression, so do nothing
         if (!a) {
            return true
         }

         // Store changes to do at once later on so undo does not get extra steps
         const changes: Array<ChangeSpec> = []

         // Expand to the left
         if (direction != 1) {
            changes.push(shrinkWeight(view, a, false))
         }

         // Expand to the right
         if (direction != -1) {
            changes.push(shrinkWeight(view, a, true))
         }

         // Expand in both ways if not direction
         view.dispatch({
            changes,
         })

         // XXX: Not type-safe. There should always be a change, so it should be fine?
         const position = changes[0] && (changes[0] as any)[1].from

         view.dispatch({
            selection: {
               anchor: position,
               head: position,
            },
         })

         continue
      }
      return true
   }

const shrinkWeight = (view: EditorView, a: SyntaxNode, next: boolean): ChangeSpec => {
   const tree = syntaxTree(view.state)
   let token: SyntaxNode | undefined
   let offset = a.to

   // Find the token to expand the group to
   while (token === undefined) {
      if (a.name == 'WeightedExpression') {
         let child: SyntaxNode | null | undefined = next ? a.firstChild : a.lastChild

         while (child != null && child.name != 'Identifier') {
            if (child && child.name == 'Content') {
               const children = child.getChildren('Identifier')

               if (children.length > 0) {
                  child = children[next ? 0 : children.length - 1]
                  if (child) {
                     child = next ? child.nextSibling : child.prevSibling
                  }
                  break
               }
            }

            // Go one over to shrink
            child = next ? child.nextSibling : child.prevSibling
         }

         if (child == null) {
            return { from: 0, to: 0, insert: '' }
         }

         token = child
         break
      }

      // SAFEGUARD
      if (++offset - a.to > 5000) {
         break
      }
   }

   if (!token) {
      return { from: 0, to: 0, insert: '' }
   }

   const number = bang(a.node.lastChild, 'A')
   if ((number.name as PromptLangNodeName) !== 'Number') {
      throw new Error(`❌ Expected a number`)
   }

   const numberTxt = view.state.doc.sliceString(number.from, number.to)
   const weight = parseFloat(numberTxt)

   const text = view.state.doc.sliceString(token.from, token.to)
   // Contract to the left
   if (next) {
      return [
         // Remove '('
         { from: a.from, to: a.from + 1, insert: '' },
         // Insert '(' in front of new place
         { from: token.from, to: token.from, insert: '(' },
      ]
   }

   // Expand to the left
   return [
      // Remove weights
      { from: number.from - 1, to: number.to + 1, insert: '' },
      // Add weights back in
      { from: token.to, to: token.to, insert: `:${weight})` },
   ]
}

const shiftWeights =
   (direction: number, stopAt: PromptLangNodeName[]) =>
   (view: EditorView): boolean => {
      const ranges = view.state.selection.ranges
      const tree = syntaxTree(view.state)

      let index = 0
      for (const r of ranges) {
         // TODO(bird_d/prompting/logic): Make this find the first weighted expression inside the selected range and go from there.
         // Do nothing if there is a selection for now
         if (r.from != r.to) {
            index++
            continue
         }

         let a: SyntaxNode | null = $smartResolve(tree, r.to)

         // Make sure we have the entire WeightedExpression group selected
         while (a && a.name != 'WeightedExpression') {
            a = a.parent
         }

         // Token was not inside a WeightedExpression, so do nothing
         if (!a) {
            return true
         }

         // Store changes to do at once later on so undo does not get extra steps
         const changes: Array<ChangeSpec> = []

         // Expand to the left
         if (direction != 1) {
            changes.push(shrinkWeight(view, a, false))
            changes.push(growWeight(view, a, false))
         }

         // Expand to the right
         if (direction != -1) {
            changes.push(shrinkWeight(view, a, true))
            changes.push(growWeight(view, a, true))
         }

         // Expand in both ways if not direction
         view.dispatch({
            changes,
         })

         // XXX: Not type-safe. There should always be a change, so it should be fine?
         const position = changes[0] && (changes[0] as any)[1].from

         view.dispatch({
            selection: {
               anchor: position,
               head: position,
            },
         })

         continue
      }
      return true
   }
