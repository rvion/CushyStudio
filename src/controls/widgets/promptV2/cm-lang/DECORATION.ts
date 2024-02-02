import { syntaxTree } from '@codemirror/language'
import { Range, RangeSet } from '@codemirror/state'
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view'

export const placeholders = ViewPlugin.fromClass(
    class {
        placeholders: RangeSet<Decoration> // DecorationSet
        loraMark = Decoration.mark({ class: 'cm-lora' })
        wildcardMark = Decoration.mark({ class: 'cm-wildcard' })
        constructor(view: EditorView) {
            this.placeholders = this.computeDecorations(view)
        }
        update(update: ViewUpdate) {
            if (!update.docChanged) return
            this.placeholders = this.computeDecorations(update.view)
        }

        private computeDecorations(view: EditorView): DecorationSet {
            const decorations: Range<Decoration>[] = []
            syntaxTree(view.state).iterate({
                enter: (ref) => {
                    if (ref.name == 'Lora') {
                        decorations.push({ from: ref.from, to: ref.to, value: this.loraMark })
                    }
                    if (ref.name == 'Wildcards') {
                        decorations.push({ from: ref.from, to: ref.to, value: this.wildcardMark })
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
