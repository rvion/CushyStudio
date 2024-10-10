import type { Command } from '../csuite/commands/Command'
import type { MenuEntry } from '../csuite/menu/MenuEntry'

import { commandManager } from '../csuite/commands/CommandManager'
import { menuWithoutProps, MenuWithoutProps } from '../csuite/menu/Menu'
import { PanelShortcuts } from '../panels/PanelShortcuts/PanelShortcuts'

export const menuCommands = menuWithoutProps({
    title: 'Commands',
    // entries: () => [...allLayoutCommands],
    entries: (): MenuEntry[] => {
        return [
            PanelShortcuts.defaultCommand,
            ...commandManager.knownContexts.map((c) =>
                new MenuWithoutProps({
                    title: c.name,
                    entries: (): Command<any>[] => c.commandsArr,
                    icon: 'mdiKeyboardCaps',
                }).bind(),
            ),
        ]
    },
})

export const MenuCommandsUI = (): JSX.Element => <menuCommands.UI />
