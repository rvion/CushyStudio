import 'rc-dock/dist/rc-dock-dark.css'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { ComfyManager } from '../core/ComfyManager'
import { stContext } from './stContext'
import { AppLayoutUI } from './AppLayoutUI'

export const AppUI = observer(function AppUI_() {
    const st = useMemo(() => new ComfyManager(), [])
    return (
        <stContext.Provider value={st}>
            <AppLayoutUI />
        </stContext.Provider>
    )
})
