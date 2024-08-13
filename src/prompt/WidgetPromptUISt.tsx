import type { CompiledPrompt, Field_prompt } from './FieldPrompt'

import { EditorState } from '@codemirror/state'
import { EditorView } from 'codemirror'
import { makeAutoObservable, observable } from 'mobx'
import { createRef } from 'react'

import { PromptLang } from './cm-lang/LANG'
import { basicSetup } from './cm-lang/SETUP'
import { generatePromptCombinations } from './compiler/promptsplit'
import { Prompt_Lora, PromptAST } from './grammar/grammar.practical'

export class WidgetPromptUISt {
    mountRef = createRef<HTMLDivElement>()
    editorView: Maybe<EditorView> = null
    editorState: EditorState

    replaceTextBy(nextText: string): void {
        this.editorView?.dispatch({
            changes: { from: 0, to: this.editorView.state.doc.length, insert: nextText },
        })
    }
    constructor(public widget: Field_prompt) {
        this.editorState = EditorState.create({
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
        // add a 'ok' at the end though a dispatch action
        this.editorState.update({
            changes: { from: this.text.length, to: this.text.length, insert: 'ok' },
        })
        makeAutoObservable(this, {
            editorView: observable.ref,
            editorState: observable.ref,
            mountRef: false,
        })
    }

    // get/set
    get text(): string {
        return this.widget.serial.val ?? ''
    }

    set text(val: string) {
        this.widget.setText_INTERNAL(val)
    }

    // computed
    get ast(): PromptAST {
        return new PromptAST(this.text, this.editorView)
    }

    get loras(): Prompt_Lora[] {
        return this.ast.findAll('Lora')
    }

    get debugView(): string {
        return this.ast.toString()
    }

    get compiled(): CompiledPrompt {
        return this.widget.compile({ onLora: (lora) => {} })
    }

    mount(domNode: HTMLDivElement): void {
        domNode.innerHTML = ''
        let view = new EditorView({
            state: this.editorState,
            parent: domNode,
        })
        this.editorView = view
    }

    // 🔶
    get compiled2(): string[] {
        return generatePromptCombinations(this.text!)
    }
}
