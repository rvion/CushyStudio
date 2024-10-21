import type { Command } from '../../csuite/commands/Command'

import { observer } from 'mobx-react-lite'

import { BadgeListUI } from '../../csuite/badge/BadgeListUI'
import { BadgeUI } from '../../csuite/badge/BadgeUI'
import { commandManager, parseShortcutToInputSequence } from '../../csuite/commands/CommandManager'
import { Frame, type FrameProps } from '../../csuite/frame/Frame'

export const CommandHistoryTableUI = observer(function CommandHistoryTable(p: FrameProps) {
    const lastX = commandManager.inputHistory.slice(-3)
    const out: { shortcut: string; commands: Command[] }[] = []
    for (let x = 0; x < lastX.length; x++) {
        const shortcut = lastX.slice(x).join(' ')
        const matches = commandManager.commandByShortcut.get(shortcut) ?? []
        out.push({ shortcut, commands: matches })
    }
    return (
        <Frame {...p}>
            <table>
                <thead>
                    <tr>
                        <th>combo</th>
                        <th>matches</th>
                        <th>context</th>
                    </tr>
                </thead>
                <tbody>
                    {out.toReversed().map((o, ix) => (
                        <tr key={o.shortcut}>
                            <td>
                                <BadgeListUI //
                                    autoHue
                                    getKey={(_, ix) => ix.toString()}
                                    badges={parseShortcutToInputSequence(o.shortcut)}
                                />
                            </td>
                            {/* <td>{o.commands.length}</td> */}

                            <td>
                                {o.commands.map((i, ix) => (
                                    <BadgeUI autoHue key={ix}>
                                        {i.label}
                                    </BadgeUI>
                                ))}
                            </td>
                            <td>
                                {o.commands.map((i, ix) => (
                                    <BadgeUI autoHue key={ix} children={i.ctx.name} />
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Frame>
    )
})
