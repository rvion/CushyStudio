import { observer } from 'mobx-react-lite'

import { BadgeListUI } from '../../csuite/badge/BadgeListUI'
import { BadgeUI } from '../../csuite/badge/BadgeUI'
import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'

export const DebugShortcutsFloatingUI = observer(function DebugShortcutsFloating(p: {}) {
    return (
        <div tw='absolute bottom-2 right-2 opacity-90'>
            <div tw='flex'>
                <div tw='flex flex-1'>
                    <BadgeListUI //
                        getKey={(x, ix) => ix.toString()}
                        autoHue
                        badges={cushy.commands.inputHistory.slice(-5)}
                    />
                </div>
                <Button //
                    onClick={() => (cushy.showCommandHistory = !cushy.showCommandHistory)}
                    icon='mdiClose'
                    children='Close'
                />
            </div>

            <Frame {...p}>
                <table
                    tw={[
                        //
                        '[&_th]:text-left',
                        '[&_th]:px-2',
                        '[&_td]:px-2',
                    ]}
                >
                    <thead>
                        <tr>
                            <th>combo</th>
                            <th>matches</th>
                            <th>context</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cushy.commands.lastTriggered.map(({ command, tokens, uid }, ix) => (
                            <tr key={uid}>
                                <td>
                                    <BadgeListUI autoHue badges={tokens} />
                                </td>

                                <td>
                                    <BadgeUI autoHue key={ix}>
                                        {command.label}
                                    </BadgeUI>
                                </td>
                                <td>
                                    <BadgeUI autoHue key={ix} children={command.ctx.name} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Frame>
        </div>
    )
})
