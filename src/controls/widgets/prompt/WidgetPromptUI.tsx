import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo } from 'react'
import { Plugin_LoraControlsUI } from 'src/controls/widgets/prompt/plugins/Plugin_LoraBoxUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Widget_prompt } from './WidgetPrompt'
import { WidgetPromptUISt } from './WidgetPromptUISt'
import { Plugin_AdjustWeightsUI } from './plugins/Plugin_AdjustWeights'
import { Plugin_DebugAST } from './plugins/Plugin_DebugAST'
import { Plugin_PreviewPromptUI } from './plugins/Plugin_PreviewUI'
import { Plugin_ReorderTopLevelStuffUI } from './plugins/Plugin_ReorderTopLevelStuffUI'
import { Plugin_ShortcutsUI } from './plugins/Plugin_ShortcutsUI'
import { PromptPlugin } from './plugins/PromptPlugin'
import { PluginWrapperUI } from './plugins/_PluginWrapperUI'

// UI
export const WidgetPromptUI = observer(function WidgetPromptUI_(p: { widget: Widget_prompt }) {
    const widget = p.widget
    const uist = useMemo(() => new WidgetPromptUISt(widget), [])
    useLayoutEffect(() => {
        if (uist.mountRef.current) uist.mount(uist.mountRef.current)
    }, [])

    return (
        <div tw='flex flex-col'>
            {/* HEADERS */}
            <div tw='flex justify-end gap-0.5'>
                {plugins.map((plugin) => (
                    <RevealUI trigger='hover' placement='topStart'>
                        <div tw='btn btn-icon btn-square btn-sm btn-outline text-lg'>
                            <span className='material-symbols-outlined'>{plugin.icon}</span>
                        </div>
                        <div tw='p-2'>
                            <div tw='font-bold'>{plugin.title}</div>
                            <div>{plugin.description}</div>
                        </div>
                    </RevealUI>
                ))}
            </div>
            <div ref={uist.mountRef}></div>

            {/* ACTIVE PLUGINS */}
            <div className='flex flex-col gap-1'>
                {plugins.map((plugin) => (
                    <PluginWrapperUI plugin={plugin}>
                        <plugin.Widget uist={uist} />
                    </PluginWrapperUI>
                ))}
            </div>
        </div>
    )
})

const pluginReorder = {
    key: 'plugin-reorder',
    icon: 'format_list_numbered',
    title: 'Reorder',
    description: 'Reorder top level items (drag-and-drop friendly for those without RSI yet)',
    Widget: Plugin_ReorderTopLevelStuffUI,
}
const pluginShortcuts = {
    key: 'plugin-shortcuts',
    icon: 'keyboard',
    title: 'Keyboard Shortcuts',
    description: 'Increase/Decrease weights, and more',
    Widget: Plugin_ShortcutsUI,
}
const pluginWeights = {
    key: 'plugin-weights',
    icon: 'line_weight',
    title: 'Adjust weights',
    description: 'Adjust top-level weights',
    Widget: Plugin_AdjustWeightsUI,
}
const pluginPreview = {
    key: 'plugin-preview',
    icon: 'preview',
    title: 'Preview Prompt',
    description: 'Preview the prompt that will be sent to ComfyUI',
    Widget: Plugin_PreviewPromptUI,
}
const pluginLora = {
    key: 'plugin-lora',
    icon: 'format_list_numbered',
    title: 'Lora plugin to adjust model_weight, clip_weights, and trigger words',
    description: 'Lora plugin',
    Widget: Plugin_LoraControlsUI,
}
const pluginAst = {
    key: 'plugin-ast',
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
