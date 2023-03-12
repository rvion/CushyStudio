import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { AppLayoutUI } from './AppLayoutUI'
import { stContext } from './stContext'
import { ComfyClient } from '../core/ComfyClient'
import { ToastContainer } from 'react-toastify'

export const AppUI = observer(function AppUI_() {
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
            <ToastContainer />
            <AppLayoutUI />
        </stContext.Provider>
    )
})
