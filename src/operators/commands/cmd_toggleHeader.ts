// ---------------------------------------------------------------------

import type { MenuEntry } from '../../csuite/menu/MenuEntry'

import { entries } from 'mobx'

import { CPie } from '../../csuite/activity/SimplePieMenu'
import { ctx_global } from '../../csuite/command-topic/ctx_global'
import { command, type Command, CommandContext } from '../../csuite/commands/Command'
import { defineMenu, Menu } from '../../csuite/menu/Menu'
import { Trigger } from '../../csuite/trigger/Trigger'

export const ctx_menu = new CommandContext<Menu>('OverMenu', () => {
   const x = new Menu({
      title: 'test',
      entries: (builder): MenuEntry[] => [
         builder.SimpleMenuAction({ label: 'C', onClick: () => console.log(`[🤠] A`) }),
         builder.SimpleMenuAction({ label: 'B', onClick: () => console.log(`[🤠] B`) }),
         builder.SimpleMenuAction({ label: 'C', onClick: () => console.log(`[🤠] C`) }),
      ],
      icon: 'mdiKeyboardCaps',
   })
   return x
})

export const cmd_wm_PieMenu = command({
   id: `wm.pie_menu`,
   label: 'Open Pie Menu',
   ctx: ctx_menu,
   combos: ['n'],
   action: (p) => {
      const activity = new CPie(p)
      cushy.activityManager.start(activity)
      return Trigger.Success
   },
})
