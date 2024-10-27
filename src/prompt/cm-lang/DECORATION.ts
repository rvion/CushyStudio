import type { PromptLangNodeName } from '../grammar/grammar.types'
import type { Range } from '@codemirror/state'
import type { DecorationSet, EditorView, ViewUpdate } from '@codemirror/view'

import { syntaxTree } from '@codemirror/language'
import { RangeSet } from '@codemirror/state'
import { Decoration, ViewPlugin } from '@codemirror/view'

export const placeholders = ViewPlugin.fromClass(
   class {
      placeholders: RangeSet<Decoration> // DecorationSet
      loraMark = Decoration.mark({ class: 'cm-lora' })
      wildcardMark = Decoration.mark({ class: 'cm-wildcard' })
      embeddingMark = Decoration.mark({ class: 'cm-embedding' })
      weightMark = Decoration.mark({ class: 'cm-WeightedExpression' })
      constructor(view: EditorView) {
         this.placeholders = this.computeDecorations(view)
      }
      update(update: ViewUpdate): void {
         if (!update.docChanged) return
         this.placeholders = this.computeDecorations(update.view)
      }

      computeDecorations(view: EditorView): DecorationSet {
         const decorations: Range<Decoration>[] = []
         syntaxTree(view.state).iterate({
            enter: (ref) => {
               const name = ref.name as PromptLangNodeName
               if (name == 'Lora') {
                  decorations.push({ from: ref.from, to: ref.to, value: this.loraMark })
               }
               if (name == 'Wildcard') {
                  decorations.push({ from: ref.from, to: ref.to, value: this.wildcardMark })
               }
               if (name == 'Embedding') {
                  decorations.push({ from: ref.from, to: ref.to, value: this.embeddingMark })
               }
               if (name == 'WeightedExpression') {
                  decorations.push({ from: ref.from, to: ref.to, value: this.weightMark })
               }
            },
         })
         return RangeSet.of(decorations)
      }
   },
   {
      decorations: (instance) => instance.placeholders,
      // ⏸️ provide: (plugin) =>
      // ⏸️     EditorView.atomicRanges.of((view) => {
      // ⏸️         return view.plugin(plugin)?.placeholders || Decoration.none
      // ⏸️     }),
   },
)
