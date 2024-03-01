import { observer } from 'mobx-react-lite'

import { openExternal } from 'src/app/layout/openExternal'
import { InputNumberUI } from 'src/controls/widgets/number/InputNumberUI'
import { Prompt_Lora } from 'src/controls/widgets/prompt/grammar/grammar.practical'
import { WidgetPromptUISt } from 'src/controls/widgets/prompt/WidgetPromptUISt'
import { MessageErrorUI } from 'src/panels/MessageUI'
import { Button, Input } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

export const Plugin_LoraControlsUI = observer(function Plugin_LoraControlsUI_(p: {
    //
    uist: WidgetPromptUISt
}) {
    const uist = p.uist
    return (
        <>
            {uist.loras.length === 0 && <div tw='italic text-gray-500'>No loras in prompt</div>}
            <div tw='flex flex-col p-1 gap-1'>
                {uist.loras.map((x) => {
                    return <LoraBoxUI key={x.from} uist={uist} def={x} onDelete={() => {}} />
                })}
            </div>
        </>
    )
})

const LoraBoxUI = observer(function LoraBoxUI_(p: {
    //
    uist: WidgetPromptUISt
    def: Prompt_Lora
    onDelete: () => void
}) {
    const node = p.def
    const st = useSt()
    const loraName = node.name
    if (loraName == null) return <MessageErrorUI>error parsing lora</MessageErrorUI>
    const loraMetadata = st.configFile.value?.loraPrompts?.[loraName]
    const associatedText = loraMetadata?.text ?? ''
    const associatedUrl = loraMetadata?.url ?? ''

    return (
        <div key={loraName} tw='bg-base-100 rounded p-2'>
            <div //Header
                tw='flex w-full h-10 border-b pb-2 items-center border-base-200 mb-2'
            >
                {node.name}
                <div tw='flex-0 flex-grow'></div>
                <Button //
                    size='xs'
                    icon={<span className='material-symbols-outlined'>delete_forever</span>}
                    onClick={p.onDelete}
                    tw='h-full'
                />
            </div>
            <div tw='flex gap-1 items-center'>
                <div tw='w-32 text-end'>Model Strength</div>
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
                                    changes: {
                                        from: node.nameEndsAt,
                                        to: node.nameEndsAt,
                                        insert: `[${v.toString()}]`,
                                    },
                                })
                            }
                        }}
                    />
                </div>
            </div>
            <div tw='flex gap-1 items-center'>
                <div tw='w-32 text-end'>Clip Strength</div>
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
                <div tw='w-32 text-end'>Trigger Words*</div>
                <div tw='flex flex-grow'>
                    <Input
                        //
                        tw='WIDGET-FIELD flex-grow rounded'
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
                    {/* TODO: Once a way to get/set weighted expressions from lora's cleanly we should re-add this. */}
                    {/* <InputNumberUI //
                        tw='join-item'
                        value={weighted?.weight ?? 1.0}
                        mode='float'
                        step={0.1}
                        min={-2}
                        max={2}
                        hideSlider
                        onValueChange={(v) => {
                            // Change weight, or add WeightedExpression if there is none.
                            if (weighted) {
                                weighted.weight = v
                            } else {
                                // Call change for right side first, since calling left side would change the position.
                                p.uist.editorView?.dispatch({
                                    changes: {
                                        from: node.to,
                                        to: node.to,
                                        insert: `)*${v}`,
                                    },
                                })

                                p.uist.editorView?.dispatch({
                                    changes: {
                                        from: node.from,
                                        to: node.from,
                                        insert: '(',
                                    },
                                })
                            }
                        }}
                    ></InputNumberUI> */}
                </div>
            </div>
            <div tw='opacity-50 italic text-xs'>
                *: Only trigger words will be multiplied by weights; to change the lora model and clip strength, use [x,y] syntax
            </div>
            <div tw='WIDGET-field flex rounded truncate'>
                <Button
                    tw='w-32 justify-end text-neutral-content'
                    size='sm'
                    onClick={() => openExternal(associatedUrl)}
                    appearance='link'
                    // icon={<span className='material-symbols-outlined'>open_in_new</span>}
                >
                    Associated URL
                </Button>
                <Input
                    tw='WIDGET-FIELD flex-grow  rounded'
                    type='text'
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
        </div>
    )
})
