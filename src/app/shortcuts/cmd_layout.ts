import { command, type Command } from '../../operators/Command'
import { ctx_global } from '../../operators/contexts/ctx_global'

// ACTIVE
export const cmd_maximize_active_panel: Command = command({
    id: 'cmd_maximize_active_panel',
    label: 'maximize active panel',
    ctx: ctx_global,
    combos: 'ctrl+shift+space',
    action: () => cushy.layout.maximizeActiveTabset(),
    validInInput: true,
})

// HOVERED
export const cmd_maximize_hovered_panel: Command = command({
    id: 'cmd_maximize_hovered_panel',
    label: 'maximize hovered panel',
    ctx: ctx_global,
    combos: ['alt+space', 'ctrl+u'],
    action: () => cushy.layout.maximizHoveredTabset(),
    validInInput: true,
})
