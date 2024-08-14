import { observer, useLocalObservable } from 'mobx-react-lite'

import { BadgeListUI } from '../../csuite/badge/BadgeListUI'
import { BadgeUI } from '../../csuite/badge/BadgeUI'
import { InputBoolToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { DebugControlsUI } from '../../csuite/debug/DebugControlsUI'
import { Frame } from '../../csuite/frame/Frame'
import { tooltipStuff } from '../../csuite/frame/tooltip'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
    const uist = useLocalObservable(() => ({ showCommandHistory: false }))
    return (
        <Frame
            //
            base={cushy.theme.value.appbar ?? { contrast: 0.3 }}
            tw='flex items-center px-1 h-input'
        >
            <InputBoolToggleButtonUI
                tooltip='Show Command Visualizer'
                onValueChange={(next) => (uist.showCommandHistory = next)}
                value={uist.showCommandHistory}
                icon='mdiKeyboard'
            />
            <DebugControlsUI />
            <div tw='flex-1' />
            {tooltipStuff.deepest && <div>{tooltipStuff.deepest.text}</div>}
            {uist.showCommandHistory && (
                <div tw='absolute bottom-2 right-2 opacity-90'>
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
            )}
        </Frame>
    )
})
