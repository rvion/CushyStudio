import { observer } from 'mobx-react-lite'
import { TypescriptEditorUI } from './code/ComfyCodeEditorUI'
import { ErrorScreenUI } from './ErrorScreenUI'
import { PConnectUI } from './panels/pConnect'
import { WelcomeScreenUI } from './WelcomeScreenUI'
import { useWorkspace } from './WorkspaceContext'

export const MainPanelUI = observer(function MainPanelUI_(p: {}) {
    const client = useWorkspace()

    if (client.focus == null)
        return (
            <WelcomeScreenUI>
                <PConnectUI />
                {client.CRITICAL_ERROR && <ErrorScreenUI err={client.CRITICAL_ERROR} />}
            </WelcomeScreenUI>
        )
    return <TypescriptEditorUI buffer={client.focus} />
})
