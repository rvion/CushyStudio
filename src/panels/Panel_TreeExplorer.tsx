import { observer } from 'mobx-react-lite'

import { useSt } from '../state/stateContext'
import { LibraryHeaderUI } from './libraryUI/LibraryHeaderUI'
import { TreeUI } from './libraryUI/tree/xxx/TreeUI'

export const Panel_TreeExplorer = observer(function Panel_TreeExplorer_(p: {}) {
    const st = useSt()
    return (
        <div tw='flex flex-grow flex-col overflow-auto h-full'>
            <LibraryHeaderUI />
            {/* <TreeUI shortcut='mod+1' title='Apps' tw='flex-1 overflow-auto' treeView={st.tree1View} /> */}
            <TreeUI shortcut='mod+2' title='File Explorer' tw='flex-2 overflow-auto' treeView={st.tree2View} />
        </div>
    )
})
