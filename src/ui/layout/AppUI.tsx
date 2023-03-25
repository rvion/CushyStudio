import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { FluentProvider, webDarkTheme } from '@fluentui/react-components'
import { ToastContainer } from 'react-toastify'
import { CSClient } from '../../core/CSClient'
import { GithubCorner } from '../GithubCorner'
import { stContext } from '../stContext'
import { AppBarUI } from './AppBarUI'
import { CushyLayoutUI } from './LayoutUI'
import { CSWorkspace } from '../../config/CSConfig'
import { WelcomeScreenUI } from '../WelcomeScreenUI'

export const AppUI = observer(function AppUI_() {
    const config = useMemo(() => new CSWorkspace(), [])
    const client = useMemo(() => {
        if (!config.ready) return null
        return new CSClient(config)
    }, [config.ready])

    if (client == null) return <WelcomeScreenUI />

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

// invoke('greet', { name: 'World' })
//     // `invoke` returns a Promise
//     .then((response) => console.log('🟢', response))
// console.log(testCors())
