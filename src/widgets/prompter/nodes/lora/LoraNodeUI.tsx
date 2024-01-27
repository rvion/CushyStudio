import type { LoraNode } from './LoraNode'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { observer } from 'mobx-react-lite'
import { openExternal } from 'src/app/layout/openExternal'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { Button, Input, Popover, Whisper } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

export const LoraNodeUI = observer(function LoraNodeUI_(p: { node: LoraNode }) {
    const node = p.node
    const [editor] = useLexicalComposerContext()
    const def = node.loraDef
    const st = useSt()

    const loraMetadata = st.configFile.value?.loraPrompts?.[def.name]
    const associatedText = loraMetadata?.text ?? ''
    const associatedUrl = loraMetadata?.url ?? ''

    return (
        <Whisper
            enterable
            placement='bottom'
            speaker={
                <Popover>
                    <div key={def.name}>
                        {/* <div className='shrink-0'>{def.name.replace('.safetensors', '')}</div> */}
                        <div className='flex-grow'></div>
                        <div>
                            <div>model strength</div>
                            <div tw='flex items-center'>
                                <InputNumberUI
                                    value={def.strength_model ?? 1}
                                    step={0.1}
                                    min={-2}
                                    max={2}
                                    onValueChange={(v) => (def.strength_model = v)}
                                    style={{ width: '4.5rem' }}
                                    mode='float'
                                />
                            </div>
                        </div>
                        <div>
                            <div>clip strength</div>
                            <div tw='flex items-center'>
                                <InputNumberUI
                                    value={def.strength_clip ?? 1}
                                    step={0.1}
                                    min={-2}
                                    max={2}
                                    onValueChange={(v) => (def.strength_clip = v)}
                                    style={{ width: '4.5rem' }}
                                    mode='float'
                                />
                            </div>
                        </div>

                        <div>
                            <div>Associated text</div>
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
                                        let entry = lp[def.name]
                                        if (!entry) entry = lp[def.name] = { text: '' }
                                        entry.text = nextText
                                    })
                                }}
                            />
                        </div>

                        <div>
                            <Button
                                size='xs'
                                onClick={() => openExternal(associatedUrl)}
                                appearance='link'
                                icon={<span className='material-symbols-outlined'>open_in_new</span>}
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
                                        let entry = lp[def.name]
                                        if (!entry) entry = lp[def.name] = { url: '' }
                                        entry.url = nextURL
                                    })
                                }}
                            />
                        </div>
                        <Button
                            size='xs'
                            icon={<span className='material-symbols-outlined'>delete_forever</span>}
                            onClick={() => editor.update(() => node.remove())}
                        />
                    </div>
                </Popover>
            }
        >
            <span
                //
                style={{ border: '1px solid #747474' }}
                className='text-blue-400 rv-tooltip-container p-1'
            >
                {def.name}:{def.strength_model}:{def.strength_clip} ✨
                {associatedText ? `+ "${associatedText}"` : <span tw='text-red-500'>no associated text</span>}
            </span>
        </Whisper>
    )
})
