import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'
import { type FC, Fragment } from 'react'

import { openFolderInOS } from '../../app/layout/openExternal'
import { InputBoolToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { UI } from '../../csuite/components/UI'
import { FormUI } from '../../csuite/form/FormUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { usePanel } from '../../router/usePanel'
import { openInVSCode } from '../../utils/electron/openInVsCode'
import { PanelComfyHostsUI } from '../PanelComfyHosts/Panel_ComfyUIHosts'
import { LegacyOptions } from './LegacyOptions'

export type ConfigMode = 'hosts' | 'input' | 'interface' | 'legacy' | 'system' | 'theme' | 'TEMP'

export const PanelConfig = new Panel({
    name: 'Config',
    icon: 'mdiCogOutline',
    category: 'settings',
    widget: (): FC<NO_PROPS> => PanelConfigUI,
    header: (p): PanelHeader => ({ title: 'Config', icon: undefined }),
    def: (): PanelConfigProps => ({}),
})

// hacky alias
export const PanelSettings = new Panel({
    name: 'Settings',
    icon: 'mdiCogOutline',
    category: 'settings',
    widget: (): FC<NO_PROPS> => PanelConfigUI,
    header: (p): PanelHeader => ({ title: 'Settings', icon: undefined }),
    def: (): PanelConfigProps => ({}),
})

export type PanelConfigProps = NO_PROPS

const configTabs: ConfigMode[] = ['hosts', 'input', 'interface', 'legacy', 'system', 'theme', 'TEMP']

export const PanelConfigUI = observer(function Panel_Config_(p: PanelConfigProps) {
    const panel = usePanel()

    const panelState = panel.usePersistentModel('abcd', (ui) =>
        ui.fields({
            configMode: ui.selectOneString(configTabs),
            shelfSize: ui.int(),
        }),
    )
    const modeField = panelState.fields.configMode
    const configMode = modeField.value.id
    const page: JSX.Element = ((): JSX.Element => {
        const mode = configMode
        if (mode === 'hosts') return <PanelComfyHostsUI />
        if (mode === 'input') return cushy.theme.show(({ fields: f }) => [f.inputBorder, f.inputContrast], { className: 'w-full' }) // prettier-ignore
        if (mode === 'TEMP') return <div>{panelState.renderAsForm()}</div>
        if (mode === 'interface') return <FormUI tw='flex-1' field={cushy.preferences.interface} />
        if (mode === 'legacy') return <LegacyOptions />
        if (mode === 'system') return <FormUI tw='flex-1' field={cushy.preferences.system} />
        if (mode === 'theme') return <FormUI tw='flex-1' field={cushy.theme} />
        return <Fragment>❌ unknown tab</Fragment>
    })()

    return (
        <UI.Panel>
            <UI.Panel.Header>
                <UI.Button onClick={() => openInVSCode('CONFIG.json')} children='open legacy config file' />
                <UI.Button onClick={() => openFolderInOS('settings')} children='open config folder' />
            </UI.Panel.Header>
            <UI.Frame expand row tw='overflow-auto'>
                <UI.Shelf anchor='left' defaultSize={140}>
                    <UI.Shelf.Column>
                        <ConfigTabButtonUI field={modeField} mode='legacy' />
                        <UI.Shelf.Group hueShift={100}>
                            <ConfigTabButtonUI field={modeField} mode='interface' />
                            <ConfigTabButtonUI field={modeField} mode='input' />
                            <ConfigTabButtonUI field={modeField} mode='theme' />
                        </UI.Shelf.Group>
                        <UI.Shelf.Group hueShift={200}>
                            <ConfigTabButtonUI field={modeField} mode='system' />
                            <ConfigTabButtonUI field={modeField} mode='hosts' />
                        </UI.Shelf.Group>
                        <UI.Shelf.Group hueShift={300}>
                            <ConfigTabButtonUI field={modeField} mode='TEMP' />
                        </UI.Shelf.Group>
                    </UI.Shelf.Column>
                </UI.Shelf>
                <UI.Shelf.Content>{page}</UI.Shelf.Content>
            </UI.Frame>
        </UI.Panel>
    )
})

const ConfigTabButtonUI = observer(function ConfigTabButtonUI_(p: {
    //
    mode: ConfigMode
    field: X.SelectOne_<ConfigMode>
}) {
    return (
        <InputBoolToggleButtonUI //
            tw='capitalize h-10'
            value={p.field.is(p.mode)}
            text={p.mode}
            onValueChange={(_) => p.field.setId(p.mode)}
        />
    )
})
