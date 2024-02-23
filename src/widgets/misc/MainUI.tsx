import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ToastContainer } from 'react-toastify'

import { CushyUI } from '../../app/layout/AppUI'
import { STATE } from '../../state/state'
import { stContext } from '../../state/stateContext'
import { asAbsolutePath } from '../../utils/fs/pathUtils'
import { useGlobalDropHook } from './useGlobalDropHook'
import { TargetBox } from 'src/importers/TargetBox'

const path = asAbsolutePath(process.cwd())

export const MainUI = observer(() => {
    console.log(`[🛋️] rendering CushyStudio`)
    const st = useMemo(() => runInAction(() => new STATE(path)), [])
    useGlobalDropHook(st)
    return (
        <stContext.Provider value={st}>
            <ToastContainer />
            <DndProvider backend={HTML5Backend}>
                <TargetBox>
                    <CushyUI />
                </TargetBox>
            </DndProvider>
        </stContext.Provider>
    )
})
