import { observer } from 'mobx-react-lite'
import DockLayout from 'rc-dock'
import { useWorkspace } from '../ui/WorkspaceContext'
import { CushyLayoutContext } from './LayoutCtx'

export const CushyLayoutUI = observer(function AppLayoutUI_() {
    const client = useWorkspace()
    const layout = client.layout
    return (
        <CushyLayoutContext.Provider value={client.layout}>
            <DockLayout
                groups={{ custom: {} }}
                ref={layout.getRef}
                defaultLayout={layout.layout}
                style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
            />
        </CushyLayoutContext.Provider>
    )
})
