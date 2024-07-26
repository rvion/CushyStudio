import { observer } from 'mobx-react-lite'

import { KEYS } from '../../app/shortcuts/shorcutKeys'
import { ComboUI } from '../../csuite/accelerators/ComboUI'
import { Button } from '../../csuite/button/Button'
import { InputBoolCheckboxUI } from '../../csuite/checkbox/InputBoolCheckboxUI'
import { InputNumberUI } from '../../csuite/input-number/InputNumberUI'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { parseFloatNoRoundingErr } from '../../csuite/utils/parseFloatNoRoundingErr'
import { useSt } from '../../state/stateContext'
import { openInVSCode } from '../../utils/electron/openInVsCode'
import { FieldUI } from './PanelConfig'

export const LegacyOptions = observer(function LegacyOptions_() {
    const st = useSt()
    const config = cushy.configFile

    return (
        <div tw='flex flex-col'>
            <div className='divider'>Legacy config fields to migrate 👇:</div>
            <div tw='flex flex-col gap-1'>
                <FieldUI label='Config file path'>
                    <Button look='link' icon='mdiOpenInNew' expand onClick={() => openInVSCode(st, config.path)}>
                        {config.path}
                    </Button>
                </FieldUI>
                <FieldUI label='Set tags file'>
                    <input
                        tw='csuite-basic-input w-full'
                        name='tagFile'
                        value={config.get('tagFile') ?? 'completions/danbooru.csv'}
                        onChange={(ev) => config.update({ tagFile: ev.target.value })}
                    />
                </FieldUI>
                <FieldUI label='Your github username'>
                    <input //
                        tw='csuite-basic-input w-full'
                        value={config.value.githubUsername}
                        onChange={(ev) => config.update({ githubUsername: ev.target.value })}
                        name='githubUsername'
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
                    <InputBoolCheckboxUI
                        onValueChange={(next) => config.update({ enableTypeCheckingBuiltInApps: next })}
                        value={config.value.enableTypeCheckingBuiltInApps ?? false}
                    />
                </FieldUI>
                <FieldUI label='Check update every X minutes'>
                    <input //
                        tw='csuite-basic-input w-full'
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
                <FieldUI label='Configure hosts:'>
                    <Button icon={'mdiOpenInNew'} onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}>
                        Open Hosts page
                        <ComboUI combo={KEYS.openPage_Hosts} />
                    </Button>
                </FieldUI>
                <FieldUI label='Local folder to save favorites:'>
                    <InputStringUI
                        icon='mdiFolderStar'
                        getValue={() => config.value.favoriteLocalFolderPath ?? ''}
                        setValue={(next) => config.update({ favoriteLocalFolderPath: next })}
                    />
                </FieldUI>
            </div>
        </div>
    )
})
