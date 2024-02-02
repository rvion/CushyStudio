import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import { observer } from 'mobx-react-lite'
import { openExternal } from 'src/app/layout/openExternal'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { Button, Input } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

export const LoraBoxUI = observer(function LoraBoxUI_(p: { onDelete: () => void; def: SimplifiedLoraDef }) {
    const def = p.def
    const st = useSt()

    const loraMetadata = st.configFile.value?.loraPrompts?.[def.name]
    const associatedText = loraMetadata?.text ?? ''
    const associatedUrl = loraMetadata?.url ?? ''

    return (
        <div>
            <div key={def.name}>
                {/* <div className='shrink-0'>{def.name.replace('.safetensors', '')}</div> */}
                <div className='flex-grow'></div>
                <div tw='flex gap-1 items-center'>
                    <div tw='w-32'>model strength</div>
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
                <div tw='flex gap-1 items-center'>
                    <div tw='w-32'>clip strength</div>
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
                                let entry = lp[def.name]
                                if (!entry) entry = lp[def.name] = { text: '' }
                                entry.text = nextText
                            })
                        }}
                    />
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
                                let entry = lp[def.name]
                                if (!entry) entry = lp[def.name] = { url: '' }
                                entry.url = nextURL
                            })
                        }}
                    />
                </div>
                <Button size='xs' icon={<span className='material-symbols-outlined'>delete_forever</span>} onClick={p.onDelete} />
            </div>
        </div>
    )
})
