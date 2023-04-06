import type { Maybe } from '../core/ComfyUtils'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { useMemo } from 'react'
import { ToastContainer } from 'react-toastify'
import { CustomProvider, Loader } from 'rsuite'
import { Cushy } from '../cushy/Cushy'
import { CSContext } from '../cushy/CushyContext'
import { ImportWindowUI } from '../importers/ImportWindow'
import { GithubCorner } from '../ui/GithubCorner'
import { workspaceContext } from '../ui/WorkspaceContext'
import { OpenWorkspaceUI } from '../welcome/OpenWorkspaceUI'
import { WelcomeScreenUI } from '../welcome/WelcomeScreenUI'
import { AppBarUI } from './AppBarUI'
import { CushyLayoutUI } from './LayoutUI'
import { TroubleShootinInstructionsUI } from './TroubleShootinInstructionsUI'

export const AppUI = observer(function AppUI_() {
    const csWrapper = useLocalObservable(() => ({
        cs: null as Maybe<Cushy>,
    }))
    useMemo(async () => {
        csWrapper.cs = await Cushy.CREATE()
    }, [])

    const cs = csWrapper.cs

    // <FluentProvider theme={webDarkTheme} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    // </FluentProvider>
    // 1. if app is not ready, show a loading screen
    if (!cs?.ready) {
        return (
            <CustomProvider
            //
            // theme='dark'
            >
                <WelcomeScreenUI>
                    <Loader />
                    <TroubleShootinInstructionsUI />
                </WelcomeScreenUI>
            </CustomProvider>
        )
    }
    return (
        <CSContext.Provider value={cs}>
            <CustomProvider
                //
                theme={cs?.userConfig?.value?.theme ?? 'dark'}
            >
                {/* <FluentProvider theme={webDarkTheme} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}> */}
                {/* 2. if no workspace is opened, show the open-workspace UI */}
                {cs.workspace == null ? (
                    <WelcomeScreenUI>
                        <OpenWorkspaceUI />
                    </WelcomeScreenUI>
                ) : (
                    // 3. otherwise, show the IDE
                    <workspaceContext.Provider value={cs.workspace}>
                        <GithubCorner />
                        <ToastContainer />
                        <ImportWindowUI />
                        <AppBarUI />
                        <div className='relative grow'>
                            <CushyLayoutUI />
                        </div>
                    </workspaceContext.Provider>
                )}
            </CustomProvider>
            {/* </FluentProvider> */}
        </CSContext.Provider>
    )
})
