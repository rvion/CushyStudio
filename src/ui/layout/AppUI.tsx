import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { FluentProvider, Spinner, webDarkTheme } from '@fluentui/react-components'
import { ToastContainer } from 'react-toastify'
import { CushyStudio } from '../../config/CushyStudio'
import { GithubCorner } from '../GithubCorner'
import { workspaceContext } from '../WorkspaceContext'
import { OpenWorkspaceUI, WelcomeScreenUI } from '../WelcomeScreenUI'
import { AppBarUI } from './AppBarUI'
import { CushyLayoutUI } from './LayoutUI'
import { CSContext } from '../../config/CushyStudioContext'

export const AppUI = observer(function AppUI_() {
    const cs = useMemo(() => new CushyStudio(), [])

    if (!cs.ready)
        return (
            <FluentProvider theme={webDarkTheme} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <WelcomeScreenUI>
                    <Spinner />
                </WelcomeScreenUI>
            </FluentProvider>
        )
    return (
        <CSContext.Provider value={cs}>
            <FluentProvider theme={webDarkTheme} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {cs.workspace == null ? (
                    <WelcomeScreenUI>
                        <OpenWorkspaceUI />
                    </WelcomeScreenUI>
                ) : (
                    <workspaceContext.Provider value={cs.workspace}>
                        <GithubCorner />
                        <ToastContainer />
                        <AppBarUI />
                        <div className='relative grow'>
                            <CushyLayoutUI />
                        </div>
                    </workspaceContext.Provider>
                )}
            </FluentProvider>
        </CSContext.Provider>
    )
})

// invoke('greet', { name: 'World' })
//     // `invoke` returns a Promise
//     .then((response) => console.log('🟢', response))
// console.log(testCors())
