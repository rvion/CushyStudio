import { observer } from 'mobx-react-lite'

import { MessageInfoUI } from '../../csuite'
import { Button } from '../../csuite/button/Button'
import { commandManager } from '../../csuite/commands/CommandManager'
import { Frame, type FrameProps } from '../../csuite/frame/Frame'
import { Trigger } from '../../csuite/trigger/Trigger'

export const CommandContextDebugUI = observer(function CommandContextDebug(p: FrameProps) {
    return (
        <Frame {...p} col tw='gap-2'>
            <h3>Command Contexts</h3>
            <Frame line wrap>
                {commandManager.knownContexts.map((c) => {
                    const NOK = c.check() === Trigger.UNMATCHED
                    return (
                        <Button //
                            line
                            // disabled
                            icon={NOK ? 'mdiCancel' : 'mdiCheck'}
                            look={NOK ? 'error' : 'success'}
                            key={c.name}
                            children={c.name}
                        >
                            {/* <td>{NOK ? '❌' : '🟢'}</td> */}
                        </Button>
                    )
                })}
            </Frame>
            <MessageInfoUI>
                <div>Every context can be ON or OFF</div>
                <div>Every context have state that is available tot the command</div>
                <div>Every context can be active or innactive</div>
            </MessageInfoUI>
        </Frame>
    )
})
