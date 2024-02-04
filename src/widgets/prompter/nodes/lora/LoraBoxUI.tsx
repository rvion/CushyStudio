import { observer } from 'mobx-react-lite'
import { openExternal } from 'src/app/layout/openExternal'
import { WidgetPromptUISt } from 'src/controls/widgets/prompt/WidgetPromptUISt'
import { MessageErrorUI, MessageInfoUI } from 'src/panels/MessageUI'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { Button, Input } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

export type LoraTextNode = {
    loraName?: Enum_LoraLoader_lora_name
    strength_clip?: number
    strength_model?: number
    namePos?: { from: number; to: number }
    num1Pos?: { from: number; to: number }
    num2Pos?: { from: number; to: number }
}

export const LoraBoxUI = observer(function LoraBoxUI_(p: {
    //
    uist: WidgetPromptUISt
    def: LoraTextNode
    onDelete: () => void
}) {
    const def = p.def
    const st = useSt()
    const loraName = def.loraName
    if (loraName == null) return <MessageErrorUI>error parsing lora</MessageErrorUI>
    const loraMetadata = st.configFile.value?.loraPrompts?.[loraName]
    const associatedText = loraMetadata?.text ?? ''
    const associatedUrl = loraMetadata?.url ?? ''
    // const numbers = def.ref.node.getChildren('Number')
    return (
        <div key={loraName} tw='bdl1'>
            {def.loraName}
            <div tw='flex gap-1 items-center'>
                <div tw='w-32'>model strength</div>
                <div tw='flex items-center'>
                    <InputNumberUI
                        value={def.strength_model ?? 1}
                        style={{ width: '4.5rem' }}
                        mode='float'
                        step={0.1}
                        min={-2}
                        max={2}
                        onValueChange={(v) => {
                            const num1 = def.num1Pos
                            if (num1) {
                                p.uist.editorView?.dispatch({
                                    changes: { from: num1.from, to: num1.to, insert: v.toString() },
                                })
                            } else {
                                if (def.namePos == null) return
                                p.uist.editorView?.dispatch({
                                    changes: {
                                        from: def.namePos?.to,
                                        to: def.namePos?.to,
                                        insert: `[${v.toString()}]`,
                                    },
                                })
                            }
                        }}
                    />
                </div>
            </div>
            <div tw='flex gap-1 items-center'>
                <div tw='w-32'>clip strength</div>
                <div tw='flex items-center'>
                    <InputNumberUI
                        value={def.strength_clip ?? 1}
                        style={{ width: '4.5rem' }}
                        mode='float'
                        step={0.1}
                        min={-2}
                        max={2}
                        onValueChange={(v) => {
                            const num2 = def.num2Pos
                            if (num2) {
                                p.uist.editorView?.dispatch({
                                    changes: { from: num2.from, to: num2.to, insert: v.toString() },
                                })
                            } else {
                                if (def.num1Pos == null) return
                                p.uist.editorView?.dispatch({
                                    changes: {
                                        from: def.num1Pos?.to,
                                        to: def.num1Pos?.to,
                                        insert: `,${v.toString()}`,
                                    },
                                })
                            }
                        }}
                    />
                </div>
            </div>
            <div tw='opacity-50 italic'>note: only trigger words will be multiplied</div>
            <div tw='flex gap-1 items-center'>
                <div tw='w-32'>Associated text</div>
                <Input
                    //
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
                <div>* {'<weights>'} </div>
            </div>

            <div>
                <Button
                    size='sm'
                    onClick={() => openExternal(associatedUrl)}
                    appearance='link'
                    // icon={<span className='material-symbols-outlined'>open_in_new</span>}
                >
                    Associated URL
                </Button>
                <Input
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
            <Button size='xs' icon={<span className='material-symbols-outlined'>delete_forever</span>} onClick={p.onDelete} />
        </div>
    )
})
