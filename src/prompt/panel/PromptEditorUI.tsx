import type { FieldId } from '../../csuite/model/FieldId'
import type { Field_prompt } from '../FieldPrompt'
import type { Prompt_Lora } from '../grammar/grammar.practical'

import { EditorState } from '@codemirror/state'
import { EditorView } from 'codemirror'
import { makeAutoObservable, observable, reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { createRef, useLayoutEffect, useMemo } from 'react'

import { InputBoolUI } from '../../csuite/checkbox/InputBoolUI'
import { Frame } from '../../csuite/frame/Frame'
import { BasicShelfUI } from '../../csuite/shelf/ShelfUI'
import { PromptLang } from '../cm-lang/LANG'
import { basicSetup } from '../cm-lang/SETUP'
import { PromptAST } from '../grammar/grammar.practical'

type X = { id: FieldId; label?: string }

export const PromptEditorUI = observer(function PromptEditorUI_(p: { promptID: Field_prompt['id'] }) {
   // 1. retrieve the widget to get the inital value
   // |  the widget won't be used afterwise unless we programmatically do stuff with it
   const field = cushy.repository.getFieldByID(p.promptID) as Field_prompt | undefined

   // 2. create a self-contained state to play with prompt-lang
   // | completely independent from the widget thing
   const uist = useMemo(
      () =>
         new (class {
            // ------------------------------------------------------------------
            /** local copy of the text value of the local codemirror */
            internalText: string = ''

            /** remote text value */
            get linkedText(): string {
               return this.currentlyLinkedWidget?.text ?? ''
            }

            set linkedText(v: string) {
               if (this.currentlyLinkedWidget == null) return
               this.currentlyLinkedWidget.text = v
            }

            // ------------------------------------------------------------------
            setInternalText = (nextText: string): void => {
               if (this.internalText === nextText) return
               this.editorView?.dispatch({
                  changes: { from: 0, to: this.editorView.state.doc.length, insert: nextText },
               })
            }

            // ------------------------------------------------------------------
            get currentlyLinkedWidget(): Field_prompt | undefined {
               return this._currentlyLinkedWidget
            }
            set currentlyLinkedWidget(v: Field_prompt | undefined) {
               if (v === this._currentlyLinkedWidget) return
               if (v == null) return

               this._currentlyLinkedWidget = v
               this.linkedText = v.text ?? ''
               this.setInternalText(v.text ?? '')
            }

            // ------------------------------------------------------------------
            mountRef = createRef<HTMLDivElement>()

            editorView: Maybe<EditorView> = null

            editorState: EditorState

            get ast(): PromptAST {
               return new PromptAST(this.linkedText, this.editorView)
            }

            get loras(): Prompt_Lora[] {
               return this.ast.findAll('Lora')
            }

            get debugView(): string {
               return this.ast.toString()
            }

            mount = (domNode: HTMLDivElement): void => {
               domNode.innerHTML = ''
               const view = new EditorView({ state: this.editorState, parent: domNode })
               this.editorView = view
            }

            constructor(private _currentlyLinkedWidget?: Field_prompt) {
               this.editorState = EditorState.create({
                  doc: this.linkedText,
                  extensions: [
                     //
                     EditorView.updateListener.of((ev) => {
                        // const from = ev.state.selection.main.from
                        // const tree = syntaxTree(ev.state)
                        if (ev.docChanged) {
                           const nextText = ev.state.doc.toString()
                           this.internalText = nextText
                           this.linkedText = nextText
                        }
                     }),
                     basicSetup,
                     PromptLang(),
                  ],
               })
               // add a 'ok' at the end though a dispatch action
               this.editorState.update({
                  changes: { from: this.linkedText.length, to: this.linkedText.length, insert: 'ok' },
               })

               reaction(
                  () => this.linkedText,
                  (newText) => this.setInternalText(newText),
               )
               makeAutoObservable(this, {
                  editorView: observable.ref,
                  editorState: observable.ref,
                  mountRef: false,
               })
            }
         })(field),
      [cushy.activePrompt],
   )

   // mount
   useLayoutEffect(() => {
      if (uist.mountRef.current) uist.mount(uist.mountRef.current)
   }, [cushy.activePrompt])

   const ast = uist.ast
   const theme = cushy.preferences.theme.value

   return (
      <div tw='flex flex-1 flex-row overflow-auto'>
         <Frame className='ͼo' base={{ contrast: -0.05 }} tw='flex h-full flex-grow flex-col gap-1'>
            {/* <MessageInfoUI title='instructions'> select the [from] to change the to widget </MessageInfoUI> */}
            {/* <div className='flex flex-wrap'>
            {cushy.repository.getWidgetsByType<Field_prompt>('prompt').map((widget) => (
               <ToggleButtonUI //
                  toggleGroup='prompt-link'
                  key={widget.id}
                  text={widget.text.slice(0, 10) + '...'}
                  value={uist.currentlyLinkedWidget === widget}
                  onValueChange={() => (uist.currentlyLinkedWidget = widget)}
               />
            ))}
         </div> */}

            <div tw='h-full' ref={uist.mountRef}></div>
            {/* <Button onClick={() => uist.setInternalText(uist.linkedText + '!')}>add "!"</Button>
         <SelectUI<X>
            value={() => ({ id: p.promptID, label: 'current' })}
            getLabelText={(i) => i.label ?? i.id}
            onOptionToggled={(i) => {
               const nextWidget = cushy.repository.getFieldByID(i.id) as Field_prompt
               if (!nextWidget) return toastError('widget not found')
               if (nextWidget.type !== 'prompt') return toastError('widget is not a prompt')
               uist.currentlyLinkedWidget = nextWidget
               // uist._text = nextWidget.text
               // uist.replaceTextBy(nextWidget.text)
               // cushy.layout.addCustomV2(PromptEditorUI, { promptID: i.id })
            }}
            options={(): X[] => {
               const allPrompts = cushy.repository.getWidgetsByType<Field_prompt>('prompt')
               return allPrompts.map((i) => ({ id: i.id, label: i.text ?? '' }))
            }}
         /> */}
         </Frame>
         <BasicShelfUI anchor='right'>
            {uist.ast.findAll('Choice').map((choice, choiceIndex) => {
               const indexAST = choice.indexAST
               if (indexAST == null) {
                  return <></>
               }

               return (
                  <UY.Layout.Col
                     roundness={theme.global.roundness}
                     key={choiceIndex}
                     base={{ contrast: 0.05 }}
                     tw='gap-1 p-1'
                  >
                     <UY.Layout.Row tw='items-center p-1' base={{ contrast: -0.1 }}>
                        <span tw='flex-1 truncate'>{choice.name ?? 'No name'}</span>
                        <UY.Layout.Row tw='flex-1 !flex-shrink !flex-grow-0' align>
                           <InputBoolUI
                              square
                              icon={'mdiCancel'}
                              roundness={theme.global.roundness}
                              hover
                              value={indexAST.isBypass()}
                              display='button'
                              toggleGroup={`ast_choice_${choiceIndex}`}
                              onValueChange={() => {
                                 indexAST.setBypass()
                              }}
                           />
                           <InputBoolUI
                              square
                              icon={'mdiHelp'}
                              roundness={theme.global.roundness}
                              hover
                              value={indexAST.isRandom()}
                              display='button'
                              toggleGroup={`ast_choice_${choiceIndex}`}
                              onValueChange={() => {
                                 indexAST.setRandom()
                              }}
                           />
                        </UY.Layout.Row>
                     </UY.Layout.Row>
                     <UY.Layout.Col base={{ contrast: -0.1 }} key={choiceIndex} align>
                        {choice.expressions &&
                           choice.expressions.map((entry, index) => {
                              return (
                                 <InputBoolUI
                                    tw='!text-left'
                                    roundness={theme.global.roundness}
                                    value={
                                       choice.indexAST &&
                                       choice.indexAST.number != null &&
                                       choice.indexAST.number == index
                                    }
                                    display='button'
                                    toggleGroup={`ast_choice_${choiceIndex}`}
                                    onValueChange={() => {
                                       indexAST.number = index
                                    }}
                                 >
                                    {entry && entry.$kind && entry.$kind == 'String'
                                       ? entry.text.slice(1, -1)
                                       : entry.$kind == 'Choice' && entry.indexAST
                                         ? `?>${entry.name}[${entry.indexAST.isBypass() ? '_' : entry.indexAST.isRandom() ? '?' : entry.value}]`
                                         : entry.text}
                                 </InputBoolUI>
                              )
                           })}
                     </UY.Layout.Col>
                  </UY.Layout.Col>
               )
            })}
         </BasicShelfUI>
      </div>
   )
})
