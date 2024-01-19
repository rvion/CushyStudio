import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useSt } from '../state/stateContext'
import { LibraryHeaderUI } from './libraryUI/LibraryHeaderUI'
import { Tree } from './libraryUI/tree/xxx/Tree'
import { TreeUI } from './libraryUI/tree/xxx/TreeUI'

export const Panel_TreeExplorer = observer(function Panel_TreeExplorer_(p: {}) {
    const st = useSt()
    const tree = st.tree
    return (
        <div tw='flex flex-grow flex-col overflow-auto h-full'>
            <LibraryHeaderUI />
            <TreeUI tree={tree} />
        </div>
    )
})
