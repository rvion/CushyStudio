import type { Prompt_Lora, Prompt_WeightedExpression } from '../grammar/grammar.practical'
import type { WidgetPromptUISt } from '../WidgetPromptUISt'

import { observer } from 'mobx-react-lite'

import { openExternal } from '../../app/layout/openExternal'
import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { InputNumberUI } from '../../csuite/input-number/InputNumberUI'
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
            <div tw='flex flex-col p-1 gap-1'>
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

    // const numbers = def.ref.node.getChildren('Number')
    return (
        <Frame base={5} tw='rounded p-2'>
            <div //Header
                tw='flex w-full h-10 border-b pb-2 items-center border-base-200 mb-2'
            >
                <div //Join Lora selection and Delete Button
                    tw='flex-1 join'
                >
                    <SelectUI<string>
                        tw='join-item'
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
                </div>
                {/* {node.name}
                <div tw='flex-0 flex-grow'></div>
                <Button //
                    size='xs'
                    icon='mdiDeleteForever'
                    onClick={p.onDelete}
                    tw='h-full'
                /> */}
            </div>
            {/* {node.name} */}
            <div tw='flex gap-1 items-center'>
                <div tw='w-32'>Model Strength</div>
                <div tw='flex flex-grow items-center'>
                    <InputNumberUI
                        value={node.strength_model ?? 1}
                        mode='float'
                        step={0.1}
                        min={-2}
                        max={2}
                        hideSlider
                        onValueChange={(v) => {
                            const num1 = node.getChild('Number', 0)
                            if (num1) num1.setNumber(v)
                            else {
                                if (node.nameEndsAt == null) return
                                p.uist.editorView?.dispatch({
                                    changes: { from: node.nameEndsAt, to: node.nameEndsAt, insert: `[${v.toString()}]` },
                                })
                            }
                        }}
                    />
                </div>
            </div>
            <div tw='flex gap-1 items-center'>
                <div tw='w-32'>Clip Strength</div>
                <div tw='flex flex-grow items-center'>
                    <InputNumberUI
                        value={node.strength_clip ?? 1}
                        mode='float'
                        step={0.1}
                        min={-2}
                        max={2}
                        hideSlider
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
            </div>
            <div tw='flex gap-1 items-center'>
                <div tw='w-32'>Trigger Words*</div>
                <div tw='flex flex-grow join'>
                    <InputLegacy
                        //
                        tw='h-input rounded join-item'
                        type='text'
                        value={associatedText}
                        onChange={(ev) => {
                            const nextText = ev.target.value
                            st.configFile.update((prev) => {
                                // ensure prev.loraPrompts
                                if (!prev.loraPrompts) prev.loraPrompts = {}
                                const lp = prev.loraPrompts
                                // ensure entry for lora name
                                let entry = lp[loraName]
                                if (!entry) entry = lp[loraName] = { text: '' }
                                entry.text = nextText
                            })
                        }}
                    />
                    <InputNumberUI //
                        tw='join-item'
                        value={weighted?.weight ?? 1.0}
                        mode='float'
                        step={0.1}
                        min={-2}
                        max={2}
                        hideSlider
                        onValueChange={(v) => {
                            if (weighted) weighted.weight = v
                            else node.wrapWithWeighted(v)
                        }}
                    />
                </div>
            </div>
            <div tw='opacity-50 italic text-xs'>
                *: Only trigger words will be multiplied by weights; to change the lora model and clip strength, use [x,y] syntax
            </div>
            <div tw='flex items-center gap-1'>
                <Button size='input' icon='mdiOpenInNew' onClick={() => openExternal(associatedUrl)}>
                    Associated URL
                </Button>
                <InputLegacy
                    type='text'
                    tw='w-full'
                    placeholder='Associated URL....'
                    value={associatedUrl}
                    onChange={(ev) => {
                        const nextURL = ev.target.value
                        st.configFile.update((prev) => {
                            // ensure prev.loraPrompts
                            if (!prev.loraPrompts) prev.loraPrompts = {}
                            const lp = prev.loraPrompts
                            // ensure entry for lora name
                            let entry = lp[loraName]
                            if (!entry) entry = lp[loraName] = { url: '' }
                            entry.url = nextURL
                        })
                    }}
                />
            </div>
        </Frame>
    )
})
