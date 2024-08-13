import type { Field_prompt } from './FieldPrompt'

import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useMemo } from 'react'

import { Button } from '../csuite/button/Button'
import { InputBoolToggleButtonUI } from '../csuite/checkbox/InputBoolToggleButtonUI'
import { WidgetSingleLineSummaryUI } from '../csuite/form/WidgetSingleLineSummaryUI'
import { Frame } from '../csuite/frame/Frame'
import { RevealUI } from '../csuite/reveal/RevealUI'
import { useSt } from '../state/stateContext'
import { PromptEditorUI } from './__TEMP__'
import { PluginWrapperUI } from './plugins/_PluginWrapperUI'
import { Plugin_AdjustWeightsUI } from './plugins/Plugin_AdjustWeights'
import { Plugin_DebugAST } from './plugins/Plugin_DebugAST'
import { Plugin_LoraControlsUI } from './plugins/Plugin_LoraBoxUI'
import { Plugin_PreviewPromptUI } from './plugins/Plugin_PreviewUI'
import { Plugin_ReorderTopLevelStuffUI } from './plugins/Plugin_ReorderTopLevelStuffUI'
import { Plugin_ShortcutsUI } from './plugins/Plugin_ShortcutsUI'
import { PromptPlugin } from './plugins/PromptPlugin'
import { WidgetPromptUISt } from './WidgetPromptUISt'

export const WidgetPrompt_LineUI = observer(function WidgetPrompt_LineUI_(p: { field: Field_prompt }) {
    const field = p.field
    return (
        <div tw='COLLAPSE-PASSTHROUGH flex flex-1 items-center justify-between'>
            {field.serial.collapsed ? (
                <WidgetSingleLineSummaryUI>{field.serial.val}</WidgetSingleLineSummaryUI>
            ) : (
                <div /* spacer */ />
            )}
            <Button
                onClick={() => cushy.layout.addCustomV2(PromptEditorUI, { promptID: field.id })}
                icon='mdiAbacus'
                subtle
                square
            />
        </div>
    )
})

export const PluginToggleBarUI = observer(function PluginToggleBarUI_(p: {}) {
    return (
        <div tw='flex gap-0.5' onMouseDown={(ev) => ev.stopPropagation()}>
            {plugins.map((plugin) => {
                const active = cushy.configFile.get(plugin.configKey) ?? false
                // const Icon = Ikon[plugin.icon]
                return (
                    <RevealUI
                        key={plugin.key}
                        trigger='hover'
                        placement='topEnd'
                        content={() => (
                            <div tw='p-2'>
                                <div tw='whitespace-nowrap font-bold'>{plugin.title}</div>
                                <div tw='whitespace-nowrap'>{plugin.description}</div>
                            </div>
                        )}
                    >
                        <InputBoolToggleButtonUI
                            iconSize='1.2em'
                            value={Boolean(active)}
                            icon={plugin.icon}
                            onValueChange={() => cushy.configFile.set(plugin.configKey, !active)}
                        />
                    </RevealUI>
                )
            })}
        </div>
    )
})

// UI
export const WidgetPromptUI = observer(function WidgetPromptUI_(p: { field: Field_prompt }) {
    const st = useSt()
    const field = p.field
    const uist = useMemo(() => new WidgetPromptUISt(field), [])
    useLayoutEffect(() => {
        if (uist.mountRef.current) uist.mount(uist.mountRef.current)
    }, [])

    // widget prompt uses codemirror, and codemirror manage its internal state itsef.
    // making the widget "uncontrolled". Usual automagical mobx-reactivity may not always apply.
    // To allow CodeMirror editor to react to external value changes, we need to use an effect
    // that track external changes, and update the editor.
    useEffect(() => {
        if (field._valueUpdatedViaAPIAt == null) return
        uist.replaceTextBy(field.text)
    }, [field._valueUpdatedViaAPIAt])

    const haveAtLeastOnePluginActive = plugins.some((plugin) => st.configFile.get(plugin.configKey) ?? false)
    return (
        <div
            tw='flex flex-1 flex-col'
            onKeyDownCapture={(ev) => {
                // Prevent new-line when using the run shortcut
                // XXX: This should be removed once running a draft is implemented using the proper shortcut method.
                // ⏸️ if (ev.ctrlKey && ev.key == ' ') {
                // ⏸️     ev.preventDefault()
                // ⏸️     ev.stopPropagation()
                // ⏸️ }
                if (ev.ctrlKey && ev.key == 'Enter') {
                    ev.preventDefault()
                    ev.stopPropagation()
                }
            }}
        >
            <div ref={uist.mountRef}></div>

            {/* ACTIVE PLUGINS */}
            <PluginToggleBarUI />
            {haveAtLeastOnePluginActive && (
                <Frame className='flex flex-col gap-1 p-1 my-1'>
                    {plugins.map((plugin) => {
                        const active = st.configFile.get(plugin.configKey) ?? false
                        if (!active) return null
                        return (
                            <PluginWrapperUI key={plugin.key} plugin={plugin}>
                                <plugin.Widget uist={uist} />
                            </PluginWrapperUI>
                        )
                    })}
                </Frame>
            )}
        </div>
    )
})

const pluginReorder: PromptPlugin = {
    key: 'plugin-reorder',
    configKey: 'showPromptPluginPreview',
    icon: 'mdiCursorMove',
    title: 'Reorder',
    description: 'Reorder top level items (drag-and-drop friendly for those without RSI yet)',
    Widget: Plugin_ReorderTopLevelStuffUI,
}
const pluginShortcuts: PromptPlugin = {
    key: 'plugin-shortcuts',
    configKey: 'showPromptPluginReorder',
    icon: 'mdiCodeJson',
    title: 'Keyboard Shortcuts',
    description: 'Increase/Decrease weights, and more',
    Widget: Plugin_ShortcutsUI,
}
const pluginWeights: PromptPlugin = {
    key: 'plugin-weights',
    configKey: 'showPromptPluginWeights',
    icon: 'mdiWeightKilogram',
    title: 'Adjust weights',
    description: 'Adjust top-level weights',
    Widget: Plugin_AdjustWeightsUI,
}
const pluginPreview: PromptPlugin = {
    key: 'plugin-preview',
    configKey: 'showPromptPluginLora',
    icon: 'mdiText',
    title: 'Preview Prompt',
    description: 'Preview the prompt that will be sent to ComfyUI',
    Widget: Plugin_PreviewPromptUI,
}
const pluginLora: PromptPlugin = {
    key: 'plugin-lora',
    configKey: 'showPromptPluginAst',
    icon: 'mdiAt',
    title: 'Lora plugin to adjust model_weight, clip_weights, and trigger words',
    description: 'Lora plugin',
    Widget: Plugin_LoraControlsUI,
}
const pluginAst: PromptPlugin = {
    key: 'plugin-ast',
    configKey: 'showPromptPluginShortcuts',
    icon: 'mdiKeyboard',
    title: 'Show Ast',
    description: 'Show the Prompt AST to review if everything is as expected',
    Widget: Plugin_DebugAST,
}
const plugins: PromptPlugin[] = [
    //
    pluginPreview,
    pluginReorder,
    pluginWeights,
    pluginLora,
    pluginAst,
    pluginShortcuts,
]
