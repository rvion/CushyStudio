import 'rc-dock/dist/rc-dock-dark.css'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { ComfyIDEState, stContext } from './ComfyIDEState'
import { AppLayoutUI } from './AppLayoutUI'

export const AppUI = observer(function AppUI_() {
    const st = useMemo(() => new ComfyIDEState(), [])
    return (
        <stContext.Provider value={st}>
            <AppLayoutUI />
        </stContext.Provider>
    )
})
