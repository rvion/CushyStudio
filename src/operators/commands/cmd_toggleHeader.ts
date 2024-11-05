// ---------------------------------------------------------------------

import type { MenuEntry } from '../../csuite/menu/MenuEntry'

import { CPie } from '../../csuite/activity/SimplePieMenu'
import { command, CommandContext } from '../../csuite/commands/Command'
import { Menu } from '../../csuite/menu/Menu'
import { Trigger } from '../../csuite/trigger/Trigger'

export const ctx_menu = new CommandContext<Menu>('OverMenu', () => {
   const x = new Menu({
      title: 'test',
      entries: (builder): MenuEntry[] => [
         builder.SimpleMenuAction({ label: 'A', onClick: () => console.log(`[🤠] A`) }),
         builder.SimpleMenuAction({ label: 'B', onClick: () => console.log(`[🤠] B`) }),
         builder.SimpleMenuAction({ label: 'C', onClick: () => console.log(`[🤠] C`) }),
         builder.SimpleMenuAction({ label: 'D', onClick: () => console.log(`[🤠] D`) }),
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
