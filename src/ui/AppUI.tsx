import 'rc-dock/dist/rc-dock-dark.css'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

// import { ComfyServerInfos } from '../core/ComfyServerInfos'
import { AppLayoutUI } from './AppLayoutUI'
import { stContext } from './stContext'
import { ComfyClient } from '../core/ComfyClient'

export const AppUI = observer(function AppUI_() {
    // const backend = useMemo(() => new ComfyServerInfos(), [])
    const client = useMemo(
        () =>
            new ComfyClient({
                serverIP: '192.168.1.19',
                serverPort: 8188,
                spec: {},
            }),
        [],
    )

    // if (backend.client)
    return (
        <stContext.Provider value={client}>
            <AppLayoutUI />
        </stContext.Provider>
    )
})
