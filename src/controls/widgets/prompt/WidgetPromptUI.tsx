import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo } from 'react'

import { PluginWrapperUI } from './plugins/_PluginWrapperUI'
import { Plugin_AdjustWeightsUI } from './plugins/Plugin_AdjustWeights'
import { Plugin_DebugAST } from './plugins/Plugin_DebugAST'
import { Plugin_PreviewPromptUI } from './plugins/Plugin_PreviewUI'
import { Plugin_ReorderTopLevelStuffUI } from './plugins/Plugin_ReorderTopLevelStuffUI'
import { Plugin_ShortcutsUI } from './plugins/Plugin_ShortcutsUI'
import { PromptPlugin } from './plugins/PromptPlugin'
import { Widget_prompt } from './WidgetPrompt'
import { WidgetPromptUISt } from './WidgetPromptUISt'
import { Plugin_LoraControlsUI } from 'src/controls/widgets/prompt/plugins/Plugin_LoraBoxUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'

export const WidgetPrompt_LineUI = observer(function WidgetPrompt_LineUI_(p: { widget: Widget_prompt }) {
    const st = useSt()
    const widget = p.widget
    return (
        <div tw='flex flex-1 items-center justify-between'>
            {widget.serial.collapsed ? <div tw='line-clamp-1 italic opacity-50'>{widget.serial.val}</div> : <div></div>}
            <div
                tw='flex self-end'
                onMouseDown={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                }}
            >
                {plugins.map((plugin) => {
                    const active = st.configFile.get(plugin.configKey) ?? false
                    return (
                        <RevealUI key={plugin.key} trigger='hover' placement='topEnd'>
                            <div
                                onClick={() => st.configFile.set(plugin.configKey, !active)}
                                tw={[
                                    active ? 'btn-primary' : null,
                                    'btn btn-icon btn-square opacity-50 hover:opacity-100 btn-xs text-sm',
                                ]}
                            >
                                <span className='material-symbols-outlined'>{plugin.icon}</span>
                            </div>
                            <div tw='p-2'>
                                <div tw='whitespace-nowrap font-bold'>{plugin.title}</div>
                                <div tw='whitespace-nowrap'>{plugin.description}</div>
                            </div>
                        </RevealUI>
                    )
                })}
            </div>
        </div>
    )
})
// UI
export const WidgetPromptUI = observer(function WidgetPromptUI_(p: { widget: Widget_prompt }) {
    const st = useSt()
    const widget = p.widget
    const uist = useMemo(() => new WidgetPromptUISt(widget), [])
    useLayoutEffect(() => {
        if (uist.mountRef.current) uist.mount(uist.mountRef.current)
    }, [])
    return (
        <div
            tw='flex flex-col'
            onKeyDownCapture={(ev) => {
                // Prevent new-line when using the run shortcut
                // XXX: This should be removed once running a draft is implemented using the proper shortcut method.
                if (ev.ctrlKey && ev.key == 'Enter') {
                    ev.preventDefault()
                    ev.stopPropagation()
                }
            }}
        >
            <div ref={uist.mountRef}></div>

            {/* ACTIVE PLUGINS */}
            <div className='flex flex-col gap-1'>
                {plugins.map((plugin) => {
                    const active = st.configFile.get(plugin.configKey) ?? false
                    if (!active) return null
                    return (
                        <PluginWrapperUI key={plugin.key} plugin={plugin}>
                            <plugin.Widget uist={uist} />
                        </PluginWrapperUI>
                    )
                })}
            </div>
        </div>
    )
})

const pluginReorder: PromptPlugin = {
    key: 'plugin-reorder',
    configKey: 'showPromptPluginPreview',
    icon: 'format_list_numbered',
    title: 'Reorder',
    description: 'Reorder top level items (drag-and-drop friendly for those without RSI yet)',
    Widget: Plugin_ReorderTopLevelStuffUI,
}
const pluginShortcuts: PromptPlugin = {
    key: 'plugin-shortcuts',
    configKey: 'showPromptPluginReorder',
    icon: 'keyboard',
    title: 'Keyboard Shortcuts',
    description: 'Increase/Decrease weights, and more',
    Widget: Plugin_ShortcutsUI,
}
const pluginWeights: PromptPlugin = {
    key: 'plugin-weights',
    configKey: 'showPromptPluginWeights',
    icon: 'line_weight',
    title: 'Adjust weights',
    description: 'Adjust top-level weights',
    Widget: Plugin_AdjustWeightsUI,
}
const pluginPreview: PromptPlugin = {
    key: 'plugin-preview',
    configKey: 'showPromptPluginLora',
    icon: 'preview',
    title: 'Preview Prompt',
    description: 'Preview the prompt that will be sent to ComfyUI',
    Widget: Plugin_PreviewPromptUI,
}
const pluginLora: PromptPlugin = {
    key: 'plugin-lora',
    configKey: 'showPromptPluginAst',
    icon: 'format_list_numbered',
    title: 'Lora plugin to adjust model_weight, clip_weights, and trigger words',
    description: 'Lora plugin',
    Widget: Plugin_LoraControlsUI,
}
const pluginAst: PromptPlugin = {
    key: 'plugin-ast',
    configKey: 'showPromptPluginShortcuts',
    icon: 'account_tree',
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
