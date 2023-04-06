import { observer } from 'mobx-react-lite'
import { TypescriptEditorUI } from '../monaco/MonacoUI'
import { ErrorScreenUI } from './ErrorScreenUI'
import { PConnectUI } from '../panels/pConnect'
import { useWorkspace } from './WorkspaceContext'

export const MainPanelUI = observer(function MainPanelUI_(p: {}) {
    const client = useWorkspace()

    if (client.focusedFile == null)
        return (
            <>
                <PConnectUI />
                {client.CRITICAL_ERROR && <ErrorScreenUI err={client.CRITICAL_ERROR} />}
            </>
        )
    return <TypescriptEditorUI buffer={client.focusedFile} />
})
