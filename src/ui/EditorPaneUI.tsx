import { observer } from 'mobx-react-lite'
import { ComfyCodeEditorUI } from './ComfyCodeEditorUI'
import { ToolbarUI } from './ToolbarUI'
import { useSt } from './stContext'

export const EditorPaneUI = observer(function EditorPaneUI_() {
    const client = useSt()
    if (client.CORS_BUG)
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
                <h1>Failed to fetch ObjectInfos from backend</h1>
                <h3>Possibly a CORS issue, check your navigator logs.</h3>
            </div>
        )
    return (
        <>
            <ToolbarUI />
            <ComfyCodeEditorUI />
        </>
    )
})
