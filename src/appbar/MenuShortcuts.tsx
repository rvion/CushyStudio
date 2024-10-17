import type { Command } from '../csuite/commands/Command'
import type { MenuEntry } from '../csuite/menu/MenuEntry'

import { commandManager } from '../csuite/commands/CommandManager'
import { defineMenu, Menu } from '../csuite/menu/Menu'
import { PanelShortcuts } from '../panels/PanelShortcuts/PanelShortcuts'

export const menuCommands = defineMenu({
    title: 'Commands',
    // entries: () => [...allLayoutCommands],
    entries: (): MenuEntry[] => {
        return [
            PanelShortcuts.defaultCommand,
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
