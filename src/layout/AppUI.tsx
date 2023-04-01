import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { FluentProvider, Spinner, webDarkTheme } from '@fluentui/react-components'
import { ToastContainer } from 'react-toastify'
import { CushyStudio } from '../config/CushyStudio'
import { GithubCorner } from '../ui/GithubCorner'
import { workspaceContext } from '../ui/WorkspaceContext'
import { WelcomeScreenUI } from '../welcome/WelcomeScreenUI'
import { OpenWorkspaceUI } from '../welcome/OpenWorkspaceUI'
import { AppBarUI } from './AppBarUI'
import { CushyLayoutUI } from './LayoutUI'
import { CSContext } from '../config/CushyStudioContext'
import { TroubleShootinInstructionsUI } from './TroubleShootinInstructionsUI'

export const AppUI = observer(function AppUI_() {
    const cs = useMemo(() => new CushyStudio(), [])

    if (!cs.ready)
        return (
            <FluentProvider theme={webDarkTheme} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <WelcomeScreenUI>
                    <Spinner />
                    <TroubleShootinInstructionsUI />
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
