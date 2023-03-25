import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { FluentProvider, webDarkTheme } from '@fluentui/react-components'
import { ToastContainer } from 'react-toastify'
import { CSClient } from '../../core/CSClient'
import { GithubCorner } from '../GithubCorner'
import { stContext } from '../stContext'
import { AppBarUI } from './AppBarUI'
import { CushyLayoutUI } from './LayoutUI'

// invoke('greet', { name: 'World' })
//     // `invoke` returns a Promise
//     .then((response) => console.log('🟢', response))

// console.log(testCors())

export const AppUI = observer(function AppUI_() {
    const client = useMemo(() => new CSClient({ serverIP: 'localhost', serverPort: 8188, spec: {} }), [])
    if (!client.config.ready) return <div>loading config</div>
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
