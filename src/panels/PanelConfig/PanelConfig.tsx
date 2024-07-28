import type { NO_PROPS } from '../../csuite/types/NO_PROPS'
import type { FC } from 'react'

import { observer } from 'mobx-react-lite'

import { InputBoolToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { FormUI } from '../../csuite/form/FormUI'
import { WidgetLabelContainerUI } from '../../csuite/form/WidgetLabelContainerUI'
import { Frame } from '../../csuite/frame/Frame'
import { FormHelpTextUI } from '../../csuite/inputs/shims'
import { BasicShelfUI } from '../../csuite/shelf/ShelfUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { PanelComfyHostsUI } from '../PanelComfyHosts/Panel_ComfyUIHosts'
import { LegacyOptions } from './LegacyOptions'

export type ConfigMode = 'hosts' | 'input' | 'interface' | 'legacy' | 'system' | 'theme'

export const PanelConfig = new Panel({
    name: 'Config',
    widget: (): FC<NO_PROPS> => PanelConfigUI,
    header: (p): PanelHeader => ({ title: 'Config', icon: undefined }),
    def: (): PanelConfigProps => ({}),
})

export type PanelConfigProps = NO_PROPS

export const PanelConfigUI = observer(function Panel_Config_(p: PanelConfigProps) {
    let page: JSX.Element
    switch (cushy.configMode) {
        case 'hosts':
            page = <PanelComfyHostsUI />
            break
        case 'input':
            page = cushy.theme.show(({ fields: f }) => [f.inputBorder, f.inputContrast], { className: 'w-full' })
            break
        case 'interface':
            page = <FormUI tw='flex-1' field={cushy.preferences.interface} />
            break
        case 'legacy':
            page = <LegacyOptions />
            break
        case 'system':
            page = <FormUI tw='flex-1' field={cushy.preferences.system} />
            break
        case 'theme':
            page = <FormUI tw='flex-1' field={cushy.theme} />
            break
    }

    const ConfigModeButton = (p: { mode: ConfigMode }): JSX.Element => {
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
        <Frame expand row>
            {/* <PanelHeaderUI></PanelHeaderUI> */}
            <BasicShelfUI anchor='left'>
                <BasicShelfUI.Column /* 🌶️👋 < components can now be nested */>
                    <ConfigModeButton mode='legacy' />
                    <BasicShelfUI.Group hueShift={200} /* 🌶️👋 */>
                        <ConfigModeButton mode='interface' />
                        <ConfigModeButton mode='input' />
                        <ConfigModeButton mode='theme' />
                    </BasicShelfUI.Group>
                    <BasicShelfUI.Group hueShift={100}>
                        <ConfigModeButton mode='system' />
                        <ConfigModeButton mode='hosts' />
                    </BasicShelfUI.Group>
                </BasicShelfUI.Column>
            </BasicShelfUI>

            <div tw='flex flex-1 p-2 overflow-scroll'>{page}</div>
        </Frame>
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
