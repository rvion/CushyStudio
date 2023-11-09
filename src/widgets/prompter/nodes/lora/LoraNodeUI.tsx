import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Input, Popover, Slider, Whisper } from 'rsuite'
import { LoraNode } from './LoraNode'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { useSt } from 'src/state/stateContext'
import { bang } from 'src/utils/misc/bang'
import { openExternal } from 'src/app/layout/openExternal'

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
                                <Slider //
                                    style={{ width: '5rem' }}
                                    value={def.strength_model}
                                    onChange={(v) => (def.strength_model = parseFloatNoRoundingErr(v, 2))}
                                    step={0.1}
                                    min={-2}
                                    max={2}
                                />
                                <Input
                                    size='xs'
                                    type='number'
                                    value={def.strength_model}
                                    step={0.1}
                                    onChange={(v) => (def.strength_model = parseFloatNoRoundingErr(v, 2))}
                                    style={{ width: '4.5rem' }}
                                />
                            </div>
                        </div>
                        <div>
                            <div>clip strength</div>
                            <div tw='flex items-center'>
                                <Slider //
                                    style={{ width: '5rem' }}
                                    value={def.strength_clip}
                                    onChange={(v) => (def.strength_clip = parseFloatNoRoundingErr(v, 2))}
                                    step={0.1}
                                    min={-2}
                                    max={2}
                                />
                                <Input
                                    size='xs'
                                    type='number'
                                    value={def.strength_clip}
                                    step={0.1}
                                    onChange={(v) => (def.strength_clip = parseFloatNoRoundingErr(v, 2))}
                                    style={{ width: '4.5rem' }}
                                />
                            </div>
                        </div>

                        <div>
                            <div>Associated text</div>
                            <Input
                                //
                                type='text'
                                value={associatedText}
                                onChange={(nextText) => {
                                    st.configFile.update((prev) => {
                                        // ensure prev.loraPrompts
                                        if (!prev.loraPrompts) prev.loraPrompts = {}
                                        const lp = prev.loraPrompts
                                        // ensure entry for lora name
                                        let entry = lp[def.name]
                                        if (!entry) entry = lp[def.name] = { text: '' }
                                        entry.text = nextText
                                    })
                                    // init lora prompt if need be
                                }}
                            ></Input>
                        </div>

                        <div>
                            <Button
                                size='xs'
                                onClick={() => openExternal(associatedUrl)}
                                appearance='link'
                                startIcon={<span className='material-symbols-outlined'>open_in_new</span>}
                            >
                                Associated URL
                            </Button>
                            <Input
                                //
                                type='text'
                                value={associatedUrl}
                                onChange={(nextURL) => {
                                    st.configFile.update((prev) => {
                                        // ensure prev.loraPrompts
                                        if (!prev.loraPrompts) prev.loraPrompts = {}
                                        const lp = prev.loraPrompts
                                        // ensure entry for lora name
                                        let entry = lp[def.name]
                                        if (!entry) entry = lp[def.name] = { url: '' }
                                        entry.url = nextURL
                                    })
                                    // init lora prompt if need be
                                }}
                            ></Input>
                        </div>
                        <IconButton
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
