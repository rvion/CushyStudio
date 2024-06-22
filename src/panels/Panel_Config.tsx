import { observer } from 'mobx-react-lite'

import { KEYS } from '../app/shortcuts/shorcutKeys'
import { FormUI } from '../controls/form/FormUI'
import { WidgetLabelContainerUI } from '../controls/form/WidgetLabelContainerUI'
import { ComboUI } from '../csuite/accelerators/ComboUI'
import { Button } from '../csuite/button/Button'
import { InputBoolCheckboxUI } from '../csuite/checkbox/InputBoolCheckboxUI'
import { InputNumberUI } from '../csuite/input-number/InputNumberUI'
import { InputStringUI } from '../csuite/input-string/InputStringUI'
import { FormHelpTextUI } from '../csuite/shims'
import { parseFloatNoRoundingErr } from '../csuite/utils/parseFloatNoRoundingErr'
import { useSt } from '../state/stateContext'
import { openInVSCode } from '../utils/electron/openInVsCode'
import { run_justify, ui_justify } from './Panel_Draft/prefab_justify'
import { PanelHeaderUI } from './PanelHeader'
import { Frame } from '../csuite/frame/Frame'
import { makeAutoObservable, runInAction } from 'mobx'
import { useEffect, useMemo, type CSSProperties, type ReactNode } from 'react'
import { InputBoolToggleButtonUI } from '../csuite/checkbox/InputBoolToggleButtonUI'
import { Panel_ComfyUIHosts } from './Panel_ComfyUIHosts'

export type ConfigMode = 'hosts' | 'input' | 'legacy' | 'theme'

// Shelf stuff should probably live in another file once this is okay'd.
type ShelfProps = {
    className?: string
    defaultSize?: number
    resizeAnchor: 'left' | 'right' | 'top' | 'bottom'
    children?: ReactNode
}

let startValue = 0

class ShelfState {
    constructor(
        //
        public props: ShelfProps,
    ) {
        this.size = props.defaultSize ?? 200
        makeAutoObservable(this)
    }

    size: number
    dragging: boolean = false

    begin = () => {
        startValue = this.size

        this.dragging = true
        window.addEventListener('mousemove', this.onMouseMove, true)
        window.addEventListener('pointerup', this.end, true)
        window.addEventListener('mousedown', this.cancel, true)
        window.addEventListener('keydown', this.cancel, true)
    }

    cancel = (ev: MouseEvent | KeyboardEvent) => {
        // Only cancel if right click
        if (ev instanceof MouseEvent && ev.button != 2) {
            return
        }

        if (ev instanceof KeyboardEvent && ev.key != 'Escape') {
            return
        }

        this.size = startValue
        this.end()
    }

    onMouseMove = (ev: MouseEvent) => {
        if (this.isHorizontal()) {
            this.size += ev.movementX
            return
        }

        this.size += ev.movementY
    }

    end = () => {
        this.dragging = false
        window.removeEventListener('mousemove', this.onMouseMove, true)
        window.removeEventListener('pointerup', this.end, true)
        window.removeEventListener('mousedown', this.cancel, true)
        window.removeEventListener('keydown', this.cancel, true)
    }

    isHorizontal = (): boolean => {
        return this.props.resizeAnchor == 'left' || this.props.resizeAnchor == 'right'
    }
}

export const BasicShelf = observer(function Shelf_(p: ShelfProps) {
    const uist = useMemo(() => new ShelfState(p), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    runInAction(() => Object.assign(uist.props, p))

    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.end, [])

    const isHorizontal = uist.isHorizontal()
    // const style = {
    //     {isHorizontal && {height: ''}}
    // }

    return (
        <Frame
            className={p.className}
            tw={[
                // Feels hacky, makes sure the resize handle takes up the whole screen when dragging to not cause cursor flickering.
                !uist.dragging && 'relative',
                'flex-none',
            ]}
            // base={{ contrast: 0.1 }}
            style={{
                width: isHorizontal ? uist.size : 'unset',
                height: !isHorizontal ? uist.size : 'unset',
            }}
        >
            <div //Resize Handle Area
                tw={[
                    'absolute select-none',
                    uist.dragging && '!top-0 !left-0',
                    isHorizontal ? 'hover:cursor-ew-resize' : 'hover:cursor-ns-resize',
                ]}
                style={{
                    width: uist.dragging ? '100%' : isHorizontal ? 6 : '100%',
                    height: uist.dragging ? '100%' : !isHorizontal && !uist.dragging ? 6 : '100%',
                    [uist.props.resizeAnchor]: '-3px',
                }}
                onMouseDown={(ev) => {
                    if (ev.button != 0) {
                        return
                    }

                    uist.begin()
                }}
            />
            {p.children}
        </Frame>
    )
})

export const Panel_Config = observer(function Panel_Config_() {
    let page
    switch (cushy.configMode) {
        case 'hosts':
            page = <Panel_ComfyUIHosts />
            break
        case 'input':
            page = <>Not implemented</>
            break
        case 'legacy':
            page = <LegacyOptions />
            break
        case 'theme':
            page = <FormUI form={cushy.theme} />
            break
    }

    const ConfigModeButton = (p: { mode: ConfigMode }) => {
        return (
            <InputBoolToggleButtonUI //
                tw='capitalize h-10'
                value={cushy.configMode == p.mode}
                text={p.mode}
                onValueChange={(_) => {
                    cushy.configMode = p.mode
                }}
            />
        )
    }

    return (
        <div className='flex flex-col items-start h-full'>
            <PanelHeaderUI></PanelHeaderUI>
            <div tw='flex flex-1 flex-row overflow-clip'>
                <BasicShelf resizeAnchor='right'>
                    <div tw='flex flex-col p-2 gap'>
                        <ConfigModeButton mode='legacy' />
                        <Frame
                            tw={[
                                // 'overflow-auto',
                                // Join stuff and remove borders, can probably be a component or tw macro
                                '[&>*]:!border-none',
                            ]}
                            border
                            style={{ overflow: 'overlay !important' }}
                        >
                            <ConfigModeButton mode='hosts' />
                            <ConfigModeButton mode='input' />
                            <ConfigModeButton mode='theme' />
                        </Frame>
                    </div>
                </BasicShelf>

                <div tw='flex flex-1 p-2 overflow-scroll'>{page}</div>
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

const LegacyOptions = observer(function LegacyOptions_() {
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
                <FieldUI label='Configure hosts:'>
                    <Button icon={'mdiOpenInNew'} onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}>
                        Open Hosts page
                        <ComboUI combo={KEYS.openPage_Hosts} />
                    </Button>
                </FieldUI>
            </div>
        </div>
    )
})
