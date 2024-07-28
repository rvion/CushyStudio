import type { Command } from '../csuite/commands/Command'

import { observer } from 'mobx-react-lite'

import { ComboUI } from '../csuite/accelerators/ComboUI'
import { commandManager } from '../csuite/commands/CommandManager'
import { MessageInfoUI } from '../csuite/messages/MessageInfoUI'
import { Trigger } from '../csuite/trigger/Trigger'
import { useSt } from '../state/stateContext'
import { SectionTitleUI } from '../widgets/workspace/SectionTitle'

export const Command_ContextTableUI = observer(function Command_ContextTableUI_(p: {}) {
    return (
        <div>
            <div>Command_ContextTableUI</div>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>match</th>
                    </tr>
                </thead>
                <tbody>
                    {commandManager.knownContexts.map((c) => (
                        <tr key={c.name}>
                            <td>{c.name}</td>
                            <td>{c.check() === Trigger.UNMATCHED ? '❌' : '🟢'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
})

export const Command_HistoryTableUI = observer(function Command_HistoryTableUI_(p: {}) {
    const lastX = commandManager.inputHistory.slice(-3)
    const out: { shortcut: string; commands: Command[] }[] = []
    for (let x = 0; x < lastX.length; x++) {
        const shortcut = lastX.slice(x).join(' ')
        const matches = commandManager.commandByShortcut.get(shortcut) ?? []
        out.push({ shortcut, commands: matches })
    }
    return (
        <div tw='_MD'>
            <div>Last Attempts</div>
            <table>
                <thead>
                    <tr>
                        <th>shortcut</th>
                        <th>matches</th>
                        <th>commanNames</th>
                    </tr>
                </thead>
                <tbody>
                    {out.map((o, ix) => (
                        <tr key={o.shortcut}>
                            <td tw='text-right'>{o.shortcut}</td>
                            <td>{o.commands.length}</td>
                            <td>
                                {o.commands.map((i, ix) => (
                                    <div key={ix}>{i.label}</div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
})

export const CommandTableUI = observer(function CommandTableUI_(p: {}) {
    return (
        <div tw='_MD'>
            <Command_ContextTableUI />
            <Command_HistoryTableUI />
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>when</th>
                        <th>shortcut</th>
                        <th>commands</th>
                    </tr>
                </thead>
                <tbody>
                    {[...commandManager.commands.values()].map((c) => {
                        return (
                            <tr key={c.id}>
                                <td tw='flex-1'>{c.id}</td>
                                <td tw='flex-1'>{c.ctx.name}</td>
                                <td tw='flex-1'>{c.label}</td>
                                <td>
                                    {c.combos == null ? null : Array.isArray(c.combos) ? (
                                        c.combos.map((cc) => <ComboUI key={cc} combo={cc} />)
                                    ) : (
                                        <ComboUI combo={c.combos} />
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
})

export const Panel_Shortcuts = observer(function Panel_Shortcuts_() {
    const st = useSt()
    return (
        <div className='_MD flex flex-col gap-2 items-start p-2'>
            <SectionTitleUI label='Shortcuts' className='block' />
            <CommandTableUI />
            <MessageInfoUI
                markdown={`\
This is unfinished.

A great contribution would be to make those shortcuts editable.

Interesting files:
- ./src/app/shortcuts/shortcuts.ts
- ./src/app/shortcuts/shorcutKeys.ts
`}
            ></MessageInfoUI>
        </div>
    )
})

export const FieldUI = observer(function FieldUI_(p: {
    required?: boolean
    label?: string
    help?: string
    children: React.ReactNode
}) {
    return (
        <div className='flex gap-2 items-center'>
            <label>{p.label}</label>
            {p.children}
            {p.required && <div tw='join-item'>Required</div>}
        </div>
    )
})
