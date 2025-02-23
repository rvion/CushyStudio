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
         builder.SimpleMenuAction({
            label: '0. really long name tho what if it just kept going lmao, the quick brown fox jumped over the lazy dog',
            onClick: () => console.log(`[🤠] 0`),
         }),
         builder.SimpleMenuAction({
            label: '1. What about a long on the right?',
            onClick: () => console.log(`[🤠] 1`),
         }),
         builder.SimpleMenuAction({ label: '2', onClick: () => console.log(`[🤠] 2`) }),
         builder.SimpleMenuAction({ label: '3', onClick: () => console.log(`[🤠] 3`) }),
         builder.SimpleMenuAction({ label: '4', onClick: () => console.log(`[🤠] 4`) }),
         builder.SimpleMenuAction({ label: '5', onClick: () => console.log(`[🤠] 5`) }),
         builder.SimpleMenuAction({ label: '6', onClick: () => console.log(`[🤠] 6`) }),
         builder.SimpleMenuAction({ label: '7', onClick: () => console.log(`[🤠] 7`) }),
      ],
      icon: IKONS.mdiKeyboardCaps,
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
