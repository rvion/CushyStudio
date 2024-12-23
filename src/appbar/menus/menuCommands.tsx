import type { Command } from '../../csuite/commands/Command'
import type { MenuEntry } from '../../csuite/menu/MenuEntry'

import { commandManager } from '../../csuite/commands/CommandManager'
import { defineMenu, Menu } from '../../csuite/menu/Menu'
import { PanelShortcuts } from '../../panels/PanelShortcuts/PanelShortcuts'

export const menuCommands = defineMenu({
   title: 'Commands',
   icon: 'mdiKeyboard',
   // entries: () => [...allLayoutCommands],
   entries: (b): MenuEntry[] => {
      return [
         PanelShortcuts.defaultCommand,

         b.Divider,
         ...commandManager.knownContexts.map(
            (c) =>
               new Menu({
                  title: c.name,
                  entries: (): Command<any>[] => c.commandsArr,
                  icon: 'mdiKeyboardCaps',
               }),
         ),
      ]
   },
})
