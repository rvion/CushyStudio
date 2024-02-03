import { EditorState } from '@codemirror/state'
import { Tree } from '@lezer/common'
import { EditorView } from 'codemirror'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { createRef, useLayoutEffect, useMemo } from 'react'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import { LoraBoxUI } from 'src/widgets/prompter/nodes/lora/LoraBoxUI'
import { Widget_cmprompt } from './WidgetPromptV2'
import { PromptLang } from './cm-lang/LANG'
import { basicSetup } from './cm-lang/SETUP'
import { generatePromptCombinations } from './compiler/promptsplit'
import { parser } from './grammar/grammar.parser'
import { PromptLangNodeName } from './grammar/grammar.types'

// UI
export const WidgetCMPromptUI = observer(function WidgetStringUI_(p: { widget: Widget_cmprompt }) {
    const widget = p.widget
    const uist = useMemo(() => new CMPromptState(widget), [])
    useLayoutEffect(() => {
        if (uist.mountRef.current) uist.mount(uist.mountRef.current)
    }, [])

    return (
        <div tw='flex flex-col'>
            editor:
            <div tw='bd p-2' ref={uist.mountRef}></div>
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
            loras:
            {uist.loras.map((lname) => {
                const loradef: SimplifiedLoraDef = {
                    name: lname as any,
                    strength_clip: 1,
                    strength_model: 1,
                }
                return (
                    <div key={lname} tw='bd'>
                        {lname}
                        <LoraBoxUI def={loradef} onDelete={() => {}} />
                    </div>
                )
            })}
            debug:
            <pre tw='virtualBorder text-xs bg-base-200'>{uist.debugView}</pre>
            output:
            <pre tw='virtualBorder text-sm bg-base-200'>{uist.compiled.join('\n')}</pre>
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

    constructor(public widget: Widget_cmprompt) {
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
    get loras() {
        if (this.parsedTree === null) return []
        const OUT: string[] = []
        const self = this
        this.parsedTree?.iterate({
            enter(node) {
                // console.log(`[👙]`, node)
                const match: PromptLangNodeName = 'Lora'
                if (node.name === match) {
                    OUT.push(self.text.slice(node.from, node.to))
                }
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
    get compiled(): string[] {
        return generatePromptCombinations(this.text!)
    }
}
