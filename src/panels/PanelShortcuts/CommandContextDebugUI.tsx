import { observer } from 'mobx-react-lite'

import { commandManager } from '../../csuite/commands/CommandManager'
import { Frame, type FrameProps } from '../../csuite/frame/Frame'
import { Trigger } from '../../csuite/trigger/Trigger'

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
