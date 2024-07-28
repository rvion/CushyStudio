import type { NO_PROPS } from '../../csuite/types/NO_PROPS'
import type { FC } from 'react'

import { observer } from 'mobx-react-lite'

import { InputBoolToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { FormUI } from '../../csuite/form/FormUI'
import { Frame } from '../../csuite/frame/Frame'
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
    const page: JSX.Element = ((): JSX.Element => {
        const mode = cushy.configMode
        if (mode === 'hosts') return <PanelComfyHostsUI />
        if (mode === 'input')
            return cushy.theme.show(({ fields: f }) => [f.inputBorder, f.inputContrast], { className: 'w-full' })
        if (mode === 'interface') return <FormUI tw='flex-1' field={cushy.preferences.interface} />
        if (mode === 'legacy') return <LegacyOptions />
        if (mode === 'system') return <FormUI tw='flex-1' field={cushy.preferences.system} />
        if (mode === 'theme') return <FormUI tw='flex-1' field={cushy.theme} />
        return <>❌ unknown tab</>
    })()

    return (
        <Frame expand row>
            {/* <PanelHeaderUI></PanelHeaderUI> */}
            <BasicShelfUI anchor='left'>
                <BasicShelfUI.Column /* 🌶️👋 < components can now be nested */>
                    <ConfigTabButtonUI mode='legacy' />
                    <BasicShelfUI.Group hueShift={200} /* 🌶️👋 */>
                        <ConfigTabButtonUI mode='interface' />
                        <ConfigTabButtonUI mode='input' />
                        <ConfigTabButtonUI mode='theme' />
                    </BasicShelfUI.Group>
                    <BasicShelfUI.Group hueShift={100}>
                        <ConfigTabButtonUI mode='system' />
                        <ConfigTabButtonUI mode='hosts' />
                    </BasicShelfUI.Group>
                </BasicShelfUI.Column>
            </BasicShelfUI>

            <div tw='flex flex-1 p-2 overflow-scroll'>{page}</div>
        </Frame>
    )
})

const ConfigTabButtonUI = observer(function ConfigTabButtonUI_(p: { mode: ConfigMode }) {
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
})
