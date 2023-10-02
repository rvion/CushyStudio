import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CustomProvider } from 'rsuite'
import { asAbsolutePath } from '../../utils/fs/pathUtils'
import { stContext } from '../FrontStateCtx'
import { STATE } from '../state'
import { CushyUI } from './layout/AppUI'

const path = asAbsolutePath(process.cwd())

export const Main = observer(() => {
    const st = useMemo(() => runInAction(() => new STATE(path)), [])
    return (
        <stContext.Provider value={st}>
            <MainUI />
        </stContext.Provider>
    )
})

export const MainUI = observer(function MainUI_(p: {}) {
    return (
        <CustomProvider theme='dark'>
            <DndProvider backend={HTML5Backend}>
                <CushyUI />
            </DndProvider>
        </CustomProvider>
    )
})
