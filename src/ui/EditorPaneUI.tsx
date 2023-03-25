import { observer } from 'mobx-react-lite'
import { ComfyCodeEditorUI } from './ComfyCodeEditorUI'
import { ToolbarUI } from './ToolbarUI'
import { useSt } from './stContext'
import { ensureMonacoReady } from './Monaco'
import { CSCriticalError } from '../core/CSClient'

export const EditorPaneUI = observer(function EditorPaneUI_() {
    const client = useSt()
    const monaco = ensureMonacoReady()
    if (client.CRITICAL_ERROR) return <ErrorScreenUI err={client.CRITICAL_ERROR} />
    if (monaco == null) return <div>loading monaco</div>
    return <ComfyCodeEditorUI />
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
