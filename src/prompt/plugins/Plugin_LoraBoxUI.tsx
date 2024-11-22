import type { Prompt_Lora, Prompt_WeightedExpression } from '../grammar/grammar.practical'
import type { WidgetPromptUISt } from '../WidgetPromptUISt'

import { observer } from 'mobx-react-lite'

import { openExternal } from '../../app/layout/openExternal'
import { Button } from '../../csuite/button/Button'
import { MenuDivider } from '../../csuite/dropdown/MenuDivider'
import { Frame } from '../../csuite/frame/Frame'
import { InputNumberUI } from '../../csuite/input-number/InputNumberUI'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { InputLegacy } from '../../csuite/inputs/shims'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'
import { SelectUI } from '../../csuite/select/SelectUI'
import { useSt } from '../../state/stateContext'

// TODO: Once it is possible to get the modifier key's states, holding shift when pressing the trash button should not trim whitespace/commas

export const Plugin_LoraControlsUI = observer(function Plugin_LoraControlsUI_(p: {
   //
   uist: WidgetPromptUISt
}) {
   const uist = p.uist
   if (uist.loras.length === 0) return null
   return (
      <>
         {/* {uist.loras.length === 0 && <div tw='italic text-gray-500'>No loras in prompt</div>} */}
         <div tw='flex flex-col gap-1 p-1'>
            {uist.loras.map((loraASTNode, ix) => {
               const weighted = loraASTNode.firstAncestor('WeightedExpression')
               const isOnlyLora = weighted?.contentText == loraASTNode?.text

               return (
                  <LoraBoxUI //
                     key={`${loraASTNode.name}-${ix}`}
                     uist={uist}
                     loraASTNode={loraASTNode}
                     weightedASTNode={isOnlyLora ? weighted : null}
                     onDelete={() => {
                        let from = loraASTNode.from
                        // Delete surrounding "()*val" if exists and only contains the lora, otherwise remove only lora
                        if (weighted && isOnlyLora) {
                           weighted.remove()
                           from = weighted.from
                        } else {
                           loraASTNode.remove()
                        }

                        // Clean-up trailing white-space/commas
                        const text = uist.text.slice(from)
                        uist.editorView?.dispatch({
                           changes: {
                              //
                              from,
                              to: from + text.length - text.replace(/^[,\s]+/, '').length,
                              insert: '',
                           },
                        })
                     }}
                  />
               )
            })}
         </div>
      </>
   )
})

const LoraBoxUI = observer(function LoraBoxUI_(p: {
   //
   uist: WidgetPromptUISt
   loraASTNode: Prompt_Lora
   weightedASTNode: Maybe<Prompt_WeightedExpression>
   onDelete: () => void
}) {
   const node = p.loraASTNode
   const st = useSt()
   const loraName = node.name
   if (loraName == null) return <MessageErrorUI>error parsing lora</MessageErrorUI>
   const loraMetadata = st.configFile.value?.loraPrompts?.[loraName]
   const associatedText = loraMetadata?.text ?? ''
   const associatedUrl = loraMetadata?.url ?? ''
   const weighted = p.weightedASTNode
   const theme = cushy.theme.value

   // const numbers = def.ref.node.getChildren('Number')
   return (
      <Frame base={5} tw='rounded p-2'>
         <Frame //Join Lora selection and Delete Button
            align
            expand
            border={theme.inputBorder}
            dropShadow={theme.inputShadow}
            roundness={theme.inputRoundness}
         >
            <SelectUI<string>
               value={() => loraName}
               options={() => st.schema.getLoras()}
               onOptionToggled={(val) => {
                  node.nameNode?.setText(val)
                  // p.uist.editorView?.dispatch({
                  //     changes: {
                  //         from: node.from,
                  //         to: node.to,
                  //         insert: val.indexOf(' ') > -1 ? `@"${val}"` : `@${val}`,
                  //     },
                  // })
               }}
               getLabelText={(t): string => t}
               OptionLabelUI={(v) => <div>{v}</div>}
            />
            <Button //
               tw='WIDGET-FIELD join-item w-8'
               size='xs'
               icon='mdiDeleteForever'
               onClick={p.onDelete}
            />
         </Frame>
         {/* {node.name}
                <div tw='flex-0 flex-grow'></div>
                <Button //
                    size='xs'
                    icon='mdiDeleteForever'
                    onClick={p.onDelete}
                    tw='h-full'
                /> */}
         <MenuDivider />
         {/* {node.name} */}
         <div tw='flex flex-col items-center gap-1 w-full flex-grow'>
            <div tw='flex flex-grow flex-row gap-1 w-full'>
               <InputNumberUI
                  value={node.strength_model ?? 1}
                  mode='float'
                  step={0.1}
                  min={-2}
                  max={2}
                  hideSlider
                  text='Model Strength'
                  onValueChange={(v) => {
                     const num1 = node.getChild('Number', 0)
                     if (num1) num1.setNumber(v)
                     else {
                        if (node.nameEndsAt == null) return
                        p.uist.editorView?.dispatch({
                           changes: {
                              from: node.nameEndsAt,
                              to: node.nameEndsAt,
                              insert: `[${v.toString()}]`,
                           },
                        })
                     }
                  }}
               />
               <InputNumberUI
                  value={node.strength_clip ?? 1}
                  mode='float'
                  step={0.1}
                  min={-2}
                  max={2}
                  hideSlider
                  text='Clip Strength'
                  onValueChange={(v) => {
                     const num2 = node.getChild('Number', 1)
                     if (num2) num2.setNumber(v)
                     else {
                        const num1 = node.getChild('Number', 0)
                        if (num1 == null) return
                        p.uist.editorView?.dispatch({
                           changes: {
                              from: num1.to,
                              to: num1.to,
                              insert: `,${v.toString()}`,
                           },
                        })
                     }
                  }}
               />
            </div>
            <Frame //
               tw='w-full'
               align
               expand
               border={theme.inputBorder}
               dropShadow={theme.inputShadow}
               roundness={theme.inputRoundness}
            >
               <InputStringUI
                  //
                  tw='flex-grow px-2'
                  type='text'
                  getValue={() => associatedText}
                  placeholder='Trigger Words'
                  setValue={(val) => {
                     st.configFile.update((prev) => {
                        // ensure prev.loraPrompts
                        if (!prev.loraPrompts) prev.loraPrompts = {}
                        const lp = prev.loraPrompts
                        // ensure entry for lora name
                        let entry = lp[loraName]
                        if (!entry) entry = lp[loraName] = { text: '' }
                        entry.text = val
                     })
                  }}
               />
               <InputNumberUI //
                  tooltip='Trigger word(s) strength'
                  value={weighted?.weight ?? 1.0}
                  mode='float'
                  step={0.1}
                  min={-2}
                  max={2}
                  hideSlider
                  text='Strength'
                  onValueChange={(v) => {
                     if (weighted) weighted.weight = v
                     else node.wrapWithWeighted(v)
                  }}
               />
            </Frame>
            <Frame
               //
               tw='w-full'
               align
               expand
               border={theme.inputBorder}
               dropShadow={theme.inputShadow}
               roundness={theme.inputRoundness}
            >
               <InputStringUI // TODO(bird_d): Get this from the lora metadata itself?
                  type='text'
                  tw='w-full'
                  placeholder='Associated URL....'
                  getValue={() => associatedUrl}
                  setValue={(val) => {
                     st.configFile.update((prev) => {
                        // ensure prev.loraPrompts
                        if (!prev.loraPrompts) prev.loraPrompts = {}
                        const lp = prev.loraPrompts
                        // ensure entry for lora name
                        let entry = lp[loraName]
                        if (!entry) entry = lp[loraName] = { url: '' }
                        entry.url = val
                     })
                  }}
               />
               <Button
                  //
                  tooltip='Open associated URL in external browser'
                  icon='mdiOpenInNew'
                  onClick={() => openExternal(associatedUrl)}
               />
            </Frame>
         </div>
      </Frame>
   )
})
