import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// import { CustomProvider } from 'src/rsuite/shims'
import { asAbsolutePath } from '../../utils/fs/pathUtils'
import { stContext, useSt } from '../../state/stateContext'
import { STATE } from '../../state/state'
import { CushyUI } from '../../app/layout/AppUI'
import { TargetBox } from 'src/importers/TargetBox'

const path = asAbsolutePath(process.cwd())

export const Main = observer(() => {
    const st = useMemo(() => runInAction(() => new STATE(path)), [])
    return (
        <stContext.Provider value={st}>
            <MainUI />
        </stContext.Provider>
    )
})

const MainUI = observer(function MainUI_(p: {}) {
    const st = useSt()
    return (
        // <CustomProvider theme={st.theme.theme}>
        <DndProvider backend={HTML5Backend}>
            <TargetBox>
                <CushyUI />
            </TargetBox>
        </DndProvider>
        // </CustomProvider>
    )
})
