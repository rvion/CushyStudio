import type { Command } from '../csuite/commands/Command'
import type { MenuEntry } from '../csuite/menu/MenuEntry'

import { commandManager } from '../csuite/commands/CommandManager'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { menuWithoutProps, MenuWithoutProps } from '../csuite/menu/Menu'
import { PanelShortcuts } from '../panels/PanelShortcuts/PanelShortcuts'

const layoutShortcuts = menuWithoutProps({
    title: 'Commands',
    // entries: () => [...allLayoutCommands],
    entries: (): MenuEntry[] => {
        return [
            PanelShortcuts.defaultCommand,
            ...commandManager.knownContexts.map((c) =>
                new MenuWithoutProps({
                    title: c.name,
                    entries: (): Command<any>[] => c.commandsArr,
                }).bind(),
            ),
        ]
    },
})

export const MenuShortcutsUI = (): JSX.Element => <layoutShortcuts.UI />
