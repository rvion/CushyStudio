import { observer } from 'mobx-react-lite'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { KEYS } from 'src/app/shortcuts/shorcutKeys'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { FormControl, FormHelpText, Toggle } from 'src/rsuite/shims'
import { openInVSCode } from 'src/utils/electron/openInVsCode'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { SectionTitleUI } from 'src/widgets/workspace/SectionTitle'
import { useSt } from '../state/stateContext'

export const Panel_Config = observer(function Panel_Config_() {
    const st = useSt()
    const config = st.configFile
    return (
        <div className='flex flex-col gap-2 items-start p-2'>
            <SectionTitleUI label='CONFIG' className='block' />
            <div tw='flex flex-col gap-1'>
                <FieldUI label='Comfig file path'>
                    <pre tw='bg-base-200 rounded-btn px-2'>{config.path}</pre>
                    <div className='btn btn-sm btn-link' onClick={() => openInVSCode(st, config.path)}>
                        open <span className='material-symbols-outlined text-sm'>open_in_new</span>
                    </div>
                </FieldUI>
                <FieldUI label='Set tags file'>
                    <input
                        tw='input input-bordered input-sm w-full'
                        name='tagFile'
                        value={config.get('tagFile') ?? 'completions/danbooru.csv'}
                        onChange={(ev) => {
                            config.update({ tagFile: ev.target.value })
                            st.updateTsConfig()
                        }}
                    />
                </FieldUI>
                <FieldUI label='Preferred Text Editor'>
                    <input
                        tw='input input-bordered input-sm w-full'
                        name='preferredTextEditor'
                        value={config.get('preferredTextEditor') ?? ''}
                        onChange={(ev) => {
                            config.update({ preferredTextEditor: ev.target.value })
                            st.updateTsConfig()
                        }}
                    />
                </FieldUI>
                <FieldUI label='Your github username'>
                    <input //
                        tw='input input-bordered input-sm w-full'
                        value={config.value.githubUsername}
                        onChange={(ev) => {
                            config.update({ githubUsername: ev.target.value })
                            st.updateTsConfig()
                        }}
                        name='githubUsername'
                    />
                </FieldUI>
                <FieldUI label='Your Cushy CloudGPU api Key'>
                    <input //
                        tw='input input-bordered input-sm w-full'
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
                <FieldUI label='Number slider speed multiplier'>
                    <InputNumberUI //
                        placeholder='Number slider speed multiplier'
                        softMin={0.3}
                        softMax={3}
                        step={0.1}
                        value={config.value.numberSliderSpeed ?? 1}
                        mode='float'
                        onValueChange={(val) => config.update({ numberSliderSpeed: val })}
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
                        tw='input input-bordered input-sm'
                        type='password' //
                        value={config.value.OPENROUTER_API_KEY ?? ''}
                        onChange={(ev) => config.update({ OPENROUTER_API_KEY: ev.target.value })}
                    />
                </FieldUI>
                <FieldUI label='Configure hosts:'>
                    <div className='btn btn-sm' onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}>
                        Open Hosts page
                        <span className='material-symbols-outlined'>desktop_windows</span>
                        <ComboUI combo={KEYS.openPage_Hosts} />
                    </div>
                </FieldUI>
            </div>

            {/* <Panel_ComfyUIHosts /> */}
        </div>
    )
})

export const FieldUI = observer(function FieldUI_(p: {
    required?: boolean
    label?: string
    help?: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={p.className} tw='flex gap-2 items-center'>
            <label tw='whitespace-nowrap'>{p.label}</label>
            {p.children}
            {p.required && <FormHelpText tw='join-item'>Required</FormHelpText>}
        </div>
    )
})
