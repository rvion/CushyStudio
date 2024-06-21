import { ctx_global } from '../../csuite/command-topic/ctx_global'
import { command, type Command } from '../../csuite/commands/Command'
import { KEYS } from './shorcutKeys'
import { simpleValidInInput } from './simpleValidInInput'

// all layout command should start with
// `mod+k`

export const allLayoutCommands: Command<null>[] = [
    // maximize active panel
    command({
        id: 'cmd_maximize_active_panel',
        label: 'maximize active panel',
        ctx: ctx_global,
        combos: 'ctrl+shift+space',
        action: () => cushy.layout.maximizeActiveTabset(),
        validInInput: true,
    }),

    // maximize hovered panel
    command({
        id: 'cmd_maximize_hovered_panel',
        label: 'maximize hovered panel',
        ctx: ctx_global,
        combos: ['alt+space', 'ctrl+u'],
        action: () => cushy.layout.maximizHoveredTabset(),
        validInInput: true,
    }),

    // move active tab to the right
    simpleValidInInput(
        //
        'mod+k mod+ArrowRight',
        'move tab to the right',
        () => cushy.layout.moveActiveTabToRight(),
    ),

    // move active tab to the left
    simpleValidInInput(
        //
        'mod+k mod+ArrowLeft',
        'move tab to the right',
        () => cushy.layout.moveActiveTabToLeft(),
    ),

    simpleValidInInput(
        //
        'mod+k mod+ArrowDown',
        'move tab to the right',
        () => cushy.layout.getTabsetSurroundings(),
    ),

    command({
        id: 'closeCurrentTab',
        combos: KEYS.closeCurrentTab,
        validInInput: true,
        ctx: ctx_global,
        action: () => cushy.layout.closeCurrentTab(),
        label: 'Close current tab',
    }),
]
