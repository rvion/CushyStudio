import { observer } from 'mobx-react-lite'
import { CSCriticalError } from '../core/Workspace'
import { TypescriptEditorUI } from './ComfyCodeEditorUI'
import { ensureMonacoReady } from './Monaco'
import { PConnectUI } from './panels/pConnect'
import { WelcomeScreenUI } from './WelcomeScreenUI'
import { useWorkspace } from './WorkspaceContext'

export const MainPanelUI = observer(function MainPanelUI_(p: {}) {
    const client = useWorkspace()

    if (client.focus == null)
        return (
            <WelcomeScreenUI>
                <PConnectUI />
            </WelcomeScreenUI>
        )
    if (client.focus == 'config')
        return (
            <WelcomeScreenUI>
                <PConnectUI />
            </WelcomeScreenUI>
        )
    if (client.focus == 'ide') return <EditorPaneUI />
    return <>ERROR</>
})

ensureMonacoReady()
export const EditorPaneUI = observer(function EditorPaneUI_() {
    const client = useWorkspace()
    if (client.CRITICAL_ERROR) return <ErrorScreenUI err={client.CRITICAL_ERROR} />
    return null // 🔴
    // if (monaco == null) return <div>loading monaco</div>
    // return <ComfyCodeEditorUI />
})

export const ErrorScreenUI = observer(function ErrorScreenUI_(p: { err: CSCriticalError }) {
    return (
        <div
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                color: 'red',
                background: '#280606',
                height: '100%',
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
            }}
        >
            <h1>{p.err.title}</h1>
            <h3>{p.err.help}</h3>
        </div>
    )
})
