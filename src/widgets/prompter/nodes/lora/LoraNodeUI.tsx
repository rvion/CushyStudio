import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { observer } from 'mobx-react-lite'
import { IconButton, Input, Popover, Slider, Whisper } from 'rsuite'
import { LoraNode } from './LoraNode'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'

export const LoraNodeUI = observer(function LoraNodeUI_(p: { node: LoraNode }) {
    const node = p.node
    const [editor] = useLexicalComposerContext()
    const def = node.loraDef
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
                            <div tw='flex items-center pl-3'>
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
                            <div tw='flex items-center pl-3'>
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
            </span>
        </Whisper>
    )
})
