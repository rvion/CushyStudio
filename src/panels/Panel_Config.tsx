import { observer } from 'mobx-react-lite'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { FormControl, FormControlLabel, FormHelpText, Panel, Toggle } from 'src/rsuite/shims'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { SectionTitleUI } from 'src/widgets/workspace/SectionTitle'
import { useSt } from '../state/stateContext'
import { Panel_ComfyUIHosts } from './Panel_ComfyUIHosts'

export const Panel_Config = observer(function Panel_Config_() {
    const st = useSt()
    const config = st.configFile
    return (
        <div className='flex flex-col gap-2 items-start p-2'>
            <Panel
                //
                header={<SectionTitleUI label='CONFIG' className='block' />}
                className='col flex-grow'
            >
                <div tw='flex flex-col gap-1'>
                    <FieldUI label='Comfig file path'>
                        <pre tw='bg-base-200 rounded-btn px-2'>{config.path}</pre>
                        {/* <FormControl //
                            value={config.value.githubUsername}
                            onChange={(v) => config.update({ githubUsername: v })}
                            name='githubUsername'
                        /> */}
                    </FieldUI>
                    <FieldUI label='Your github username'>
                        <FormControl //
                            value={config.value.githubUsername}
                            onChange={(ev) => {
                                config.update({ githubUsername: ev.target.value })
                                st.updateTsConfig()
                            }}
                            name='githubUsername'
                        />
                    </FieldUI>
                    <FieldUI label='Your github username'>
                        <FormControl //
                            value={config.value.cushyCloudGPUApiKey}
                            onChange={(ev) => {
                                config.update({ cushyCloudGPUApiKey: ev.target.value })
                                st.updateTsConfig()
                            }}
                            name='githubUsername'
                        />
                    </FieldUI>

                    <FieldUI label='Gallery Image Size (px)'>
                        <InputNumberUI //
                            placeholder='48'
                            min={16}
                            max={256}
                            value={config.value.galleryImageSize ?? 48}
                            mode='int'
                            onValueChange={(val) => config.update({ galleryImageSize: val })}
                        />
                    </FieldUI>
                    <FieldUI label='Enable TypeChecking Default Apps'>
                        <Toggle
                            onChange={(t) => config.update({ enableTypeCheckingBuiltInApps: t.target.checked })}
                            checked={config.value.enableTypeCheckingBuiltInApps ?? false}
                        ></Toggle>
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
                    <FieldUI label='OpenRouter API KEY'>
                        <input
                            tw='input'
                            type='password' //
                            value={config.value.OPENROUTER_API_KEY ?? ''}
                            onChange={(ev) => config.update({ OPENROUTER_API_KEY: ev.target.value })}
                        />
                    </FieldUI>
                </div>

                {/* <Message type='info' showIcon className='self-start'>
                    <JSONHighlightedCodeUI code={JSON.stringify(config.value, null, 3)} />
                </Message> */}
                {/* <pre>{JSON.stringify(action)}</pre> */}
            </Panel>
            <Panel_ComfyUIHosts />
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
