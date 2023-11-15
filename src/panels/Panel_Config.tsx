import { observer } from 'mobx-react-lite'
import { Form, FormControl, FormControlLabel, FormGroup, FormHelpText, Panel, Toggle } from 'src/rsuite/shims'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { useSt } from '../state/stateContext'
import { SectionTitleUI } from 'src/widgets/workspace/SectionTitle'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'

export const Panel_Config = observer(function Panel_Config_() {
    const st = useSt()
    const config = st.configFile
    return (
        <div className='flex flex-col items-start p-2'>
            <Panel header={<SectionTitleUI label='CONFIG' className='block' />} className='col flex-grow'>
                <div tw='flex flex-col gap-1'>
                    <FieldUI label='Comfig file path'>
                        <pre tw='bg-gray-700'>{config.path}</pre>
                        {/* <FormControl //
                            value={config.value.githubUsername}
                            onChange={(v) => config.update({ githubUsername: v })}
                            name='githubUsername'
                        /> */}
                    </FieldUI>
                    <FieldUI label='Your github username'>
                        <FormControl //
                            value={config.value.githubUsername}
                            onChange={(ev) => config.update({ githubUsername: ev.target.value })}
                            name='githubUsername'
                        />
                    </FieldUI>
                    <FieldUI label='use Https?'>
                        <Toggle //
                            checked={config.value.useHttps}
                            onChange={(ev) => config.update({ useHttps: ev.target.checked })}
                            name='useHttps'
                        />
                    </FieldUI>
                    <Panel>
                        <FieldUI label='comfy host'>
                            <FormControl
                                //
                                value={config.value.comfyHost}
                                onChange={(ev) => config.update({ comfyHost: ev.target.value })}
                                placeholder='localhost'
                                type='text'
                                name='comfyHost'
                            />
                        </FieldUI>
                        <FieldUI label='comfy port'>
                            <FormControl //
                                value={config.value.comfyPort}
                                onChange={(ev) => {
                                    const next = ev.target.value
                                    config.update({
                                        comfyPort:
                                            typeof next === 'string' //
                                                ? parseInt(next)
                                                : typeof next === 'number'
                                                ? Math.abs(next)
                                                : 8788,
                                    })
                                }}
                                type='number'
                                placeholder='8188'
                                name='comfyPort'
                            />
                        </FieldUI>
                    </Panel>
                    <FieldUI label='Gallery Image Size (px)'>
                        <InputNumberUI //
                            placeholder='48'
                            min={16}
                            max={256}
                            val={config.value.galleryImageSize ?? 48}
                            mode='int'
                            onValueChange={(val) => config.update({ galleryImageSize: val })}
                        />
                    </FieldUI>
                    <FieldUI label='Check update every X minutes'>
                        <FormControl //
                            type='number'
                            placeholder='48'
                            name='galleryImageSize'
                            value={config.value.checkUpdateEveryMinutes ?? 5}
                            min={0.5}
                            onChange={(ev) => {
                                const next = ev.target.value
                                config.update({
                                    checkUpdateEveryMinutes:
                                        typeof next === 'string' //
                                            ? parseFloatNoRoundingErr(next, 2)
                                            : typeof next === 'number'
                                            ? next
                                            : 5,
                                })
                            }}
                        />
                    </FieldUI>
                </div>
                {/* <Message type='info' showIcon className='self-start'>
                    <JSONHighlightedCodeUI code={JSON.stringify(config.value, null, 3)} />
                </Message> */}
                {/* <pre>{JSON.stringify(action)}</pre> */}
            </Panel>
        </div>
    )
})

export const FieldUI = observer(function FieldUI_(p: {
    required?: boolean
    label?: string
    help?: string
    children: React.ReactNode
}) {
    return (
        <div className='flex gap-2 items-center'>
            <FormControlLabel>{p.label}</FormControlLabel>
            {p.children}
            {p.required && <FormHelpText tw='join-item'>Required</FormHelpText>}
        </div>
    )
})
