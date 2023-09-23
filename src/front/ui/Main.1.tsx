import { CushyUI } from './layout/AppUI'
import { CustomProvider } from 'rsuite'
import { useMemo } from 'react'
import { STATE } from '../state'
import { stContext } from '../FrontStateCtx'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { observer } from 'mobx-react-lite'
import { asAbsolutePath } from '../../utils/fs/pathUtils'
import { join } from 'path'
import { runInAction } from 'mobx'

const path = asAbsolutePath(join(process.cwd(), 'flows/'))

export const Main = observer(() => {
    const st = useMemo(
        () =>
            runInAction(
                () =>
                    new STATE(path, {
                        cushySrcPathPrefix: '../src/',
                        genTsConfig: false,
                    }),
            ),
        [],
    )
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
