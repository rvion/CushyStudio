import type { Tree } from '@lezer/common'
import { EditorView } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { makeAutoObservable } from 'mobx'
import { createRef } from 'react'
import { LoraTextNode } from 'src/widgets/prompter/nodes/lora/LoraBoxUI'
import { CompiledPrompt, Widget_prompt } from './WidgetPrompt'
import { PromptLang } from './cm-lang/LANG'
import { $extractLoraInfos } from './cm-lang/LINT'
import { basicSetup } from './cm-lang/SETUP'
import { generatePromptCombinations } from './compiler/promptsplit'
import { parser } from './grammar/grammar.parser'
import { PromptLangNodeName } from './grammar/grammar.types'

export class WidgetPromptUISt {
    mountRef = createRef<HTMLDivElement>()
    editorView: Maybe<EditorView> = null
    mount = (domNode: HTMLDivElement) => {
        domNode.innerHTML = ''
        let state = EditorState.create({
            doc: this.text,
            extensions: [
                //
                EditorView.updateListener.of((ev) => {
                    // const from = ev.state.selection.main.from
                    // const tree = syntaxTree(ev.state)
                    if (ev.docChanged) {
                        const nextText = ev.state.doc.toString()
                        this.text = nextText
                    }
                }),
                basicSetup,
                PromptLang(),
            ],
        })
        let view = new EditorView({
            state,
            parent: domNode,
        })
        this.editorView = view
    }

    constructor(public widget: Widget_prompt) {
        makeAutoObservable(this, {
            editorView: false,
        })
    }

    // -------------------------
    get text() { return this.widget.serial.val ?? ''; } // prettier-ignore
    set text(val: string) { this.widget.serial.val = val; } // prettier-ignore
    setText = (text: string) => {
        // console.log(`[👙] `, text)
        this.text = text
        // console.log(`[👙] this.debug=`, this.debugView)
    }

    // -------------------------
    get parsedTree(): Maybe<Tree> {
        // console.log(`[👙]`, parser.parse(this.text))
        return parser.parse(this.text)
    }
    // -------------------------
    get loras(): LoraTextNode[] {
        if (this.parsedTree === null) return []
        const OUT: LoraTextNode[] = []
        const self = this
        this.parsedTree?.iterate({
            enter(ref) {
                const match: PromptLangNodeName = 'Lora'
                if (ref.name !== match) return
                const infos = $extractLoraInfos(self.text, ref)
                const i = infos
                // console.log(`[👙] UUUUUU2`, JSON.stringify(i))
                OUT.push(infos)
            },
        })
        // console.log(
        //     `[👙] UUUUUUU3`,
        //     OUT.map((i) => [i.ref.name, i.ref.from, i.ref.to].toString()),
        // )
        return OUT
    }
    // -------------------------
    get debugView() {
        if (this.parsedTree === null) return null
        // console.log(`[👙] evaluating 🔶`)
        let OUT: string[] = []
        let self = this
        let depth = 0
        this.parsedTree!.iterate({
            leave(node) {
                depth--
            },
            enter(node) {
                depth++
                OUT.push(
                    [
                        `${new Array(depth - 1).fill('   ').join('')}| ${node.name}`,
                        node.name === 'Identifier'
                            ? JSON.stringify(self.text.slice(node.from, node.to))
                            : node.name === 'String'
                            ? self.text.slice(node.from, node.to)
                            : node.name === 'Number'
                            ? self.text.slice(node.from, node.to)
                            : '',
                        `(${node.from} -> ${node.to})`,
                    ].join(' '),
                )
            },
        })
        return OUT.join('\n')
    }

    // -------------------------
    get compiled2(): string[] {
        return generatePromptCombinations(this.text!)
    }

    get compiled(): CompiledPrompt {
        return this.widget.compile({ onLora: (lora) => {} })
    }
}
