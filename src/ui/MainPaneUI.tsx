import { observer } from 'mobx-react-lite'
import { TypescriptEditorUI } from '../tsEngine/TypescriptEditorUI'
import { ErrorScreenUI } from './ErrorScreenUI'
import { PConnectUI } from '../panels/pConnect'
import { useWorkspace } from './WorkspaceContext'

export const MainPanelUI = observer(function MainPanelUI_(p: {}) {
    const client = useWorkspace()

    if (client.focusedFile == null)
        return (
            <div className='rainbowbg col gap p' style={{ height: '100%' }}>
                <PConnectUI />
                {client.CRITICAL_ERROR && <ErrorScreenUI err={client.CRITICAL_ERROR} />}
            </div>
        )
    return <TypescriptEditorUI buffer={client.focusedFile} />
})
