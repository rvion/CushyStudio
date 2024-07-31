import type { Command } from '../../csuite/commands/Command'
import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { ComboUI } from '../../csuite/accelerators/ComboUI'
import { BadgeListUI } from '../../csuite/badge/BadgeListUI'
import { BadgeUI } from '../../csuite/badge/BadgeUI'
import { commandManager, parseShortcutToInputSequence } from '../../csuite/commands/CommandManager'
import { Frame, type FrameProps } from '../../csuite/frame/Frame'
import { MessageInfoUI } from '../../csuite/messages/MessageInfoUI'
import { Trigger } from '../../csuite/trigger/Trigger'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { SectionTitleUI } from '../../widgets/workspace/SectionTitle'

export const PanelShortcuts = new Panel({
    name: 'Shortcuts',
    widget: (): React.FC<NO_PROPS> => PanelShortcutsUI,
    header: (p: NO_PROPS): PanelHeader => ({ title: 'Shortcuts' }),
    def: (): NO_PROPS => ({}),
    icon: undefined,
})

export const PanelShortcutsUI = observer(function PanelShortcutsUI_(p: NO_PROPS) {
    const st = useSt()
    return (
        <div className='x_MD flex flex-col gap-2 items-start p-2'>
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

export const CommandTableUI = observer(function CommandTableUI_(p: {}) {
    return (
        <div tw='x_MD flex flex-col gap-2'>
            <Frame row wrap tw='gap-2'>
                <CommandContextDebugUI border base tw='p-2' />
                <Command_HistoryTableUI border base tw='p-2' />
            </Frame>
            <table>
                <Frame as='thead' base={10}>
                    <tr>
                        <th>id</th>
                        <th>context</th>
                        <th>shortcut</th>
                        <th>commands</th>
                    </tr>
                </Frame>
                <tbody>
                    {[...commandManager.commands.values()].map((c, ix) => {
                        return (
                            <Frame as='tr' key={c.id} base={ix % 2 === 0 ? 5 : 0}>
                                <td tw='flex-1'>{c.id}</td>
                                <td tw='flex-1'>
                                    <BadgeUI autoHue children={c.ctx.name} />
                                </td>
                                <td tw='flex-1'>{c.label}</td>
                                <td>
                                    {c.combos == null ? (
                                        <Frame line disabled icon='mdiCancel'>
                                            none
                                        </Frame>
                                    ) : Array.isArray(c.combos) ? (
                                        c.combos.map((cc) => <ComboUI key={cc} combo={cc} />)
                                    ) : (
                                        <ComboUI combo={c.combos} />
                                    )}
                                </td>
                            </Frame>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
})

export const CommandContextDebugUI = observer(function CommandContextDebug(p: FrameProps) {
    return (
        <Frame {...p} col tw='gap-2'>
            <h3>Shortcut Contexts</h3>
            {commandManager.knownContexts.map((c) => {
                const NOK = c.check() === Trigger.UNMATCHED
                return (
                    <Frame //
                        line
                        icon={NOK ? 'mdiCancel' : 'mdiCheck'}
                        look={NOK ? 'error' : 'success'}
                        key={c.name}
                        children={c.name}
                    >
                        {/* <td>{NOK ? '❌' : '🟢'}</td> */}
                    </Frame>
                )
            })}
        </Frame>
    )
})

export const Command_HistoryTableUI = observer(function Command_HistoryTableUI_(p: FrameProps) {
    const lastX = commandManager.inputHistory.slice(-3)
    const out: { shortcut: string; commands: Command[] }[] = []
    for (let x = 0; x < lastX.length; x++) {
        const shortcut = lastX.slice(x).join(' ')
        const matches = commandManager.commandByShortcut.get(shortcut) ?? []
        out.push({ shortcut, commands: matches })
    }
    return (
        <Frame {...p}>
            <div>Last Attempts</div>
            <table>
                <thead>
                    <tr>
                        <th>shortcut</th>
                        {/* <th>matches</th> */}
                        <th>commanNames</th>
                    </tr>
                </thead>
                <tbody>
                    {out.toReversed().map((o, ix) => (
                        <tr key={o.shortcut}>
                            <td>
                                <BadgeListUI autoHue badges={parseShortcutToInputSequence(o.shortcut)} />
                            </td>
                            {/* <td>{o.commands.length}</td> */}

                            <td tw='grid grid-cols-2'>
                                {o.commands.map((i, ix) => (
                                    <>
                                        <BadgeUI autoHue key={ix}>
                                            {i.label}
                                        </BadgeUI>
                                        <div> (when: {i.ctx.name})</div>
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Frame>
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
