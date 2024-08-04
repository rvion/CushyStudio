import { ctx_layout } from '../../csuite/command-topic/ctx_global'
import { command, type Command } from '../../csuite/commands/Command'
import { KEYS } from './shorcutKeys'
import { globalValidInInput } from './simpleValidInInput'

// should every layout command start with `mod+k` for some consistency ?

export const allLayoutCommands: Command<null>[] = [
    // maximize active panel
    command({
        id: 'cmd_maximize_active_panel',
        label: 'maximize active panel',
        ctx: ctx_layout,
        combos: 'ctrl+shift+space',
        action: () => cushy.layout.maximizeActiveTabset(),
        icon: 'mdiWindowMaximize',
        validInInput: true,
    }),

    // maximize hovered panel
    command({
        id: 'cmd_maximize_hovered_panel',
        label: 'maximize hovered panel',
        ctx: ctx_layout,
        combos: ['alt+space', 'ctrl+u'],
        icon: 'mdiWindowMaximize',
        action: () => cushy.layout.maximizHoveredTabset(),
        validInInput: true,
    }),

    // move active tab to the right
    globalValidInInput(
        //
        'mod+k mod+ArrowRight',
        'move tab to the right',
        () => cushy.layout.moveActiveTabToRight(),
        'mdiGamepadCircleRight',
    ),

    // move active tab to the left
    globalValidInInput(
        //
        'mod+k mod+ArrowLeft',
        'move tab to the left',
        () => cushy.layout.moveActiveTabToLeft(),
        'mdiGamepadCircleLeft',
    ),

    // globalValidInInput(
    //     //
    //     'mod+k mod+ArrowDown',
    //     'move tab to the right',
    //     () => cushy.layout.getTabsetSurroundings(),
    // ),

    command({
        id: 'closeCurrentTab',
        combos: KEYS.closeCurrentTab,
        validInInput: true,
        ctx: ctx_layout,
        action: () => cushy.layout.closeCurrentTab(),
        label: 'Close current tab',
        icon: 'mdiCloseBoxOutline',
    }),

    command({
        id: 'closeAllTabs',
        label: 'Close all tabs',
        combos: 'mod+k mod+shift+x',
        validInInput: true,
        ctx: ctx_layout,
        action: () => cushy.layout.closeAllTabs(),
        icon: 'mdiCloseBoxMultipleOutline',
    }),

    command({
        id: 'closeCurrentTabset',
        label: 'Close current tabset',
        combos: 'mod+k mod+x',
        validInInput: true,
        ctx: ctx_layout,
        action: () => cushy.layout.closeCurrentTabset(),
        icon: 'mdiCloseOctagonOutline',
    }),

    command({
        id: 'layout.focusPreviousPanel',
        label: 'Focus previous panel in tabset',
        combos: 'mod+pageup',
        validInInput: true,
        ctx: ctx_layout,
        action: () => cushy.layout.openPreviousPane(),
        icon: 'mdiArrowUpBoldBox',
    }),

    command({
        id: 'layout.focusnextPanel',
        label: 'Focus next panel in tabset',
        combos: 'mod+pageDown',
        validInInput: true,
        ctx: ctx_layout,
        action: () => cushy.layout.openNextPane(),
        icon: 'mdiArrowUpBoldBox',
    }),

    // TODO:
    // command({
    //     id: 'layout.focusFirstTabset'
    // })
]
