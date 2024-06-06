import { observer } from 'mobx-react-lite'

import { ComboUI } from '../app/accelerators/ComboUI'
import { KEYS } from '../app/shortcuts/shorcutKeys'
import { FormUI } from '../controls/FormUI'
import { WidgetLabelContainerUI } from '../controls/shared/WidgetLabelContainerUI'
import { Button } from '../csuite/button/Button'
import { InputBoolCheckboxUI } from '../csuite/checkbox/InputBoolCheckboxUI'
import { Frame } from '../csuite/frame/Frame'
import { InputNumberUI } from '../csuite/input-number/InputNumberUI'
import { InputStringUI } from '../csuite/input-string/InputStringUI'
import { FormHelpTextUI } from '../csuite/shims'
import { useSt } from '../state/stateContext'
import { openInVSCode } from '../utils/electron/openInVsCode'
import { parseFloatNoRoundingErr } from '../utils/misc/parseFloatNoRoundingErr'

export const Panel_Config = observer(function Panel_Config_() {
    const st = useSt()
    const config = st.configFile
    return (
        <div className='flex flex-col gap-2 items-start p-2'>
            <Frame border tw='flex-1 w-full' /* temp hack */>
                <FormUI form={cushy.theme} />
            </Frame>
            <div className='divider'>Legacy config fields to migrate 👇:</div>
            <div tw='flex flex-col gap-1'>
                <FieldUI label='Comfig file path'>
                    <pre tw='rounded-btn px-2'>{config.path}</pre>
                    <div className='btn btn-sm btn-link' onClick={() => openInVSCode(st, config.path)}>
                        open <span className='material-symbols-outlined text-sm'>open_in_new</span>
                    </div>
                </FieldUI>
                <FieldUI label='Set tags file'>
                    <input
                        tw='cushy-basic-input w-full'
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
                        tw='cushy-basic-input w-full'
                        name='preferredTextEditor'
                        placeholder='code (vscode)'
                        value={config.get('preferredTextEditor') ?? ''}
                        onChange={(ev) => {
                            config.update({ preferredTextEditor: ev.target.value })
                            st.updateTsConfig()
                        }}
                    />
                </FieldUI>
                <FieldUI label='Your github username'>
                    <input //
                        tw='cushy-basic-input w-full'
                        value={config.value.githubUsername}
                        onChange={(ev) => {
                            config.update({ githubUsername: ev.target.value })
                            st.updateTsConfig()
                        }}
                        name='githubUsername'
                    />
                </FieldUI>
                {/* <FieldUI label='Your Cushy CloudGPU api Key'>
                    <input //
                        tw='cushy-basic-input w-full'
                        value={config.value.cushyCloudGPUApiKey}
                        onChange={(ev) => {
                            config.update({ cushyCloudGPUApiKey: ev.target.value })
                            st.updateTsConfig()
                        }}
                        name='githubUsername'
                    />
                </FieldUI> */}
                {/* <FieldUI label='Gallery Image Size (px)'>
                    <InputNumberUI //
                        placeholder='48'
                        min={16}
                        max={256}
                        value={config.value.galleryImageSize ?? 48}
                        mode='int'
                        onValueChange={(val) => config.update({ galleryImageSize: val })}
                    />
                </FieldUI> */}
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
                    <InputBoolCheckboxUI
                        onValueChange={(next) => config.update({ enableTypeCheckingBuiltInApps: next })}
                        value={config.value.enableTypeCheckingBuiltInApps ?? false}
                    />
                </FieldUI>
                <FieldUI label='Check update every X minutes'>
                    <input //
                        tw='cushy-basic-input w-full'
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
                    <InputStringUI
                        icon='mdiKey'
                        type='password'
                        getValue={() => config.value.OPENROUTER_API_KEY ?? ''}
                        setValue={(next) => config.update({ OPENROUTER_API_KEY: next })}
                    />
                </FieldUI>

                <FieldUI label='OpenRouter API KEY'>
                    <input
                        tw=''
                        type='password' //
                        value={config.value.OPENROUTER_API_KEY ?? ''}
                        onChange={(ev) => config.update({ OPENROUTER_API_KEY: ev.target.value })}
                    />
                </FieldUI>
                <FieldUI label='Configure hosts:'>
                    <Button icon={'mdiOpenInNew'} onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}>
                        Open Hosts page
                        <ComboUI combo={KEYS.openPage_Hosts} />
                    </Button>
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
            <WidgetLabelContainerUI justify>
                <label tw='whitespace-nowrap'>{p.label}</label>
            </WidgetLabelContainerUI>
            {p.children}
            {p.required && <FormHelpTextUI tw='join-item'>Required</FormHelpTextUI>}
        </div>
    )
})
