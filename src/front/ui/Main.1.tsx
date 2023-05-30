import { CushyUI } from './layout/AppUI'
import { CustomProvider } from 'rsuite'
import { useMemo } from 'react'
import { STATE } from '../FrontState'
import { stContext } from '../FrontStateCtx'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { observer } from 'mobx-react-lite'
import { asAbsolutePath } from '../../utils/fs/pathUtils'
import { join } from 'path'
import { runInAction } from 'mobx'

const path = asAbsolutePath(join(process.cwd(), 'flows/'))

export const Main = observer(() => {
    console.log('rendering MAIN')
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
        <CustomProvider theme='dark'>
            <stContext.Provider value={st}>
                <DndProvider backend={HTML5Backend}>
                    <CushyUI />
                </DndProvider>
            </stContext.Provider>
        </CustomProvider>
    )
})
