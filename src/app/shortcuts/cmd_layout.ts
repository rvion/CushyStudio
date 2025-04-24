import { ctx_layout } from '../../csuite/command-topic/ctx_global'
import { command, type Command } from '../../csuite/commands/Command'
import { Trigger } from '../../csuite/trigger/Trigger'
import { KEYS } from './shorcutKeys'

// should every layout command start with `mod+k` for some consistency ?

export const allLayoutCommands: Command<null>[] = [
   // maximize active panel
   command({
      id: 'cmd_maximize_active_panel',
      label: 'maximize active panel',
      ctx: ctx_layout,
      combos: 'ctrl+shift+space',
      action: () => cushy.layout.maximizeActiveTabset(),
      icon: IKONS.mdiWindowMaximize,
      validInInput: true,
   }),

   // maximize hovered panel
   command({
      id: 'cmd_maximize_hovered_panel',
      label: 'maximize hovered panel',
      ctx: ctx_layout,
      combos: ['alt+space', 'ctrl+u'],
      icon: IKONS.mdiWindowMaximize,
      action: () => cushy.layout.maximizHoveredTabset(),
      validInInput: true,
   }),

   // move active tab to the right
   command({
      //
      ctx: ctx_layout,
      combos: ['mod+k mod+ArrowRight'],
      id: 'layout.move-tab-to-the-right',
      label: 'move tab to the right',
      action: () => cushy.layout.moveActiveTabToRight(),
      icon: IKONS.mdiGamepadCircleRight,
      validInInput: true,
   }),

   // move active tab to the left
   command({
      //
      ctx: ctx_layout,
      combos: ['mod+k mod+ArrowLeft'],
      id: 'layout.move-tab-to-the-left',
      label: 'move tab to the left',
      action: () => cushy.layout.moveActiveTabToLeft(),
      icon: IKONS.mdiGamepadCircleLeft,
      validInInput: true,
   }),

   command({
      id: 'closeCurrentActiveTab',
      combos: KEYS.closeCurrentActiveTab,
      validInInput: true,
      ctx: ctx_layout,
      action: () => cushy.layout.closeCurrentTab('active'),
      label: 'Close current active tab',
      icon: IKONS.mdiCloseBoxOutline,
   }),

   command({
      id: 'closeCurrentHoveredTab',
      combos: KEYS.closeCurrentHoveredTab,
      validInInput: true,
      ctx: ctx_layout,
      action: () => cushy.layout.closeCurrentTab('hoverd'),
      label: 'Close current hovered tab',
      icon: IKONS.mdiCloseBoxOutline,
   }),

   command({
      id: 'closeAllTabs',
      label: 'Close all tabs',
      combos: 'mod+k mod+shift+x',
      validInInput: true,
      ctx: ctx_layout,
      action: () => cushy.layout.closeAllTabs(),
      icon: IKONS.mdiCloseBoxMultipleOutline,
   }),

   command({
      id: 'closeCurrentTabset',
      label: 'Close current tabset',
      combos: 'mod+k mod+x',
      validInInput: true,
      ctx: ctx_layout,
      action: () => cushy.layout.closeCurrentTabset(),
      icon: IKONS.mdiCloseOctagonOutline,
   }),

   command({
      id: 'layout.focusPreviousPanel',
      label: 'Focus previous panel in tabset',
      combos: 'mod+pageup',
      validInInput: true,
      ctx: ctx_layout,
      action: () => cushy.layout.openPreviousPane(),
      icon: IKONS.mdiArrowUpBoldBox,
   }),

   command({
      id: 'layout.focusnextPanel',
      label: 'Focus next panel in tabset',
      combos: 'mod+pageDown',
      validInInput: true,
      ctx: ctx_layout,
      action: () => cushy.layout.openNextPane(),
      icon: IKONS.mdiArrowUpBoldBox,
   }),

   command({
      id: 'layout.widen-hovered-tabset',
      label: 'widen hovered tabset',
      combos: 'mod+ctrl+arrowright',
      validInInput: true,
      ctx: ctx_layout,
      icon: IKONS.mdiArrowExpandHorizontal,
      action: () => {
         cushy.layout.widenTabset('hoverd')
         return Trigger.Success
      },
   }),

   command({
      id: 'layout.shrink-hovered-tabset',
      label: 'shrink hovered tabset',
      combos: 'mod+ctrl+arrowleft',
      validInInput: true,
      ctx: ctx_layout,
      icon: IKONS.mdiArrowExpandHorizontal,
      action: () => {
         cushy.layout.shrinkTabset('hoverd')
         return Trigger.Success
      },
   }),

   command({
      id: 'layout.reset-tabset-size',
      label: 'Reset Tabset Size',
      combos: 'mod+ctrl+r',
      validInInput: true,
      ctx: ctx_layout,
      icon: IKONS.mdiLockReset,
      action: () => {
         cushy.layout.resetTabsetSize('hoverd')
         return Trigger.Success
      },
   }),
]

// TODO:
// command({
//     id: 'layout.focusFirstTabset'
// })

// globalValidInInput(
//     //
//     'mod+k mod+ArrowDown',
//     'move tab to the right',
//     () => cushy.layout.getTabsetSurroundings(),
// ),
