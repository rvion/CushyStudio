import { observer } from 'mobx-react-lite'
import DockLayout from 'rc-dock'
import { useMemo } from 'react'
import { CushyLayoutContext } from './LayoutCtx'
import { CushyLayoutState } from './LayoutState'

export const CushyLayoutUI = observer(function AppLayoutUI_() {
    const layout = useMemo(() => new CushyLayoutState(), [])
    return (
        <CushyLayoutContext.Provider value={layout}>
            <DockLayout
                groups={{ custom: {} }}
                ref={layout.getRef}
                defaultLayout={layout.layout}
                style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
            />
        </CushyLayoutContext.Provider>
    )
})
