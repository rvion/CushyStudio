import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { FluentProvider, webDarkTheme } from '@fluentui/react-components'
import { invoke } from '@tauri-apps/api'
import { ToastContainer } from 'react-toastify'
import { ComfyClient } from '../../core/ComfyClient'
import { testCors } from '../cors'
import { GithubCorner } from '../GithubCorner'
import { ensureMonacoReady } from '../Monaco'
import { stContext } from '../stContext'
import { CushyLayoutUI } from './CushyLayoutUI'
import { AppBarUI } from './AppBarUI'

invoke('greet', { name: 'World' })
    // `invoke` returns a Promise
    .then((response) => console.log('🟢', response))

console.log(testCors())

export const AppUI = observer(function AppUI_() {
    const monaco = ensureMonacoReady()
    const client = useMemo(() => {
        if (monaco == null) return null
        return new ComfyClient({
            serverIP: 'localhost',
            serverPort: 8188,
            spec: {},
        })
    }, [monaco])

    if (monaco == null) return <div>loading monaco</div>

    // if (backend.client)
    return (
        <FluentProvider theme={webDarkTheme} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <stContext.Provider value={client}>
                <GithubCorner />
                <ToastContainer />
                <AppBarUI />
                <div className='relative grow'>
                    <CushyLayoutUI />
                </div>
            </stContext.Provider>
        </FluentProvider>
    )
})
