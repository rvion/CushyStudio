import type { Tree } from '@lezer/common'
import { EditorView } from 'codemirror'
import { EditorState } from '@codemirror/state'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { createRef, useLayoutEffect, useMemo } from 'react'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { LoraBoxUI, LoraTextNode } from 'src/widgets/prompter/nodes/lora/LoraBoxUI'
import { CompiledPrompt, Widget_prompt } from './WidgetPrompt'
import { PromptLang } from './cm-lang/LANG'
import { $extractLoraInfos } from './cm-lang/LINT'
import { basicSetup } from './cm-lang/SETUP'
import { generatePromptCombinations } from './compiler/promptsplit'
import { parser } from './grammar/grammar.parser'
import { PromptLangNodeName } from './grammar/grammar.types'
// UI
export const WidgetPromptUI = observer(function WidgetPromptUI_(p: { widget: Widget_prompt }) {
    const widget = p.widget
    const uist = useMemo(() => new CMPromptState(widget), [])
    useLayoutEffect(() => {
        if (uist.mountRef.current) uist.mount(uist.mountRef.current)
    }, [])

    return (
        <div tw='flex flex-col'>
            <div tw='bd1' ref={uist.mountRef}></div>
            <summary tw='text-sm'>
                <details>
                    <pre tw='virtualBorder whitespace-pre-wrap text-sm bg-base-200'>{uist.compiled.positivePrompt}</pre>
                    <pre tw='virtualBorder whitespace-pre-wrap text-sm bg-base-200'>{uist.compiled.negativePrompt}</pre>
                    <div tw='text-xs italic'>
                        <div tw='flex gap-2'>
                            weight + :
                            <ComboUI combo={'mod+j'} />
                            (or <ComboUI combo={'mod+shift+j'} /> for tiniest scope)
                        </div>
                        <div tw='flex gap-2'>
                            weight - :
                            <ComboUI combo={'mod+k'} />
                            (or <ComboUI combo={'mod+shift+j'} /> for tiniest scope)
                        </div>
                    </div>
                    <pre tw='virtualBorder whitespace-pre-wrap text-xs bg-base-200'>{uist.debugView}</pre>
                </details>
            </summary>
            {uist.loras.map((x: LoraTextNode) => {
                return (
                    <div key={x.loraName} tw='bd'>
                        {x.loraName}
                        <LoraBoxUI def={x} onDelete={() => {}} />
                    </div>
                )
            })}
        </div>
    )
})

class CMPromptState {
    mountRef = createRef<HTMLDivElement>()

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
    }

    constructor(public widget: Widget_prompt) {
        makeAutoObservable(this)
    }

    // -------------------------
    get text() { return this.widget.serial.val ?? '' } // prettier-ignore
    set text(val: string) { this.widget.serial.val = val } // prettier-ignore
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
                OUT.push(infos)
            },
        })
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
