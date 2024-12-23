import type { PromptPlugin } from './PromptPlugin'

import { Plugin_AdjustWeightsUI } from './Plugin_AdjustWeights'
import { Plugin_DebugAST } from './Plugin_DebugAST'
import { Plugin_LoraControlsUI } from './Plugin_LoraBox/Plugin_LoraBoxUI'
import { Plugin_PreviewPromptUI } from './Plugin_PreviewUI'
import { Plugin_ReorderTopLevelStuffUI } from './Plugin_ReorderTopLevelStuffUI'
import { Plugin_ShortcutsUI } from './Plugin_ShortcutsUI'

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

export const plugins: PromptPlugin[] = [
   //
   pluginPreview,
   pluginReorder,
   pluginWeights,
   pluginLora,
   pluginAst,
   pluginShortcuts,
]
