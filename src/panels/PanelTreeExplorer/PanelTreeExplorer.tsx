import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { TreeUI } from '../../csuite/tree/TreeUI'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { LibraryHeaderUI } from './TreeExplorerHeader'

export const PanelTreeExplorer = new Panel({
    name: 'TreeExplorer',
    widget: (): React.FC<NO_PROPS> => PanelTreeExplorerUI,
    header: (p: NO_PROPS): PanelHeader => ({ title: 'FileList' }),
    def: (): NO_PROPS => ({}),
    icon: 'mdiFileTree',
    category: 'app',
})

export const PanelTreeExplorerUI = observer(function PanelTreeExplorerUI_(p: NO_PROPS) {
    const st = useSt()
    return (
        <>
            <PanelHeaderUI>
                <LibraryHeaderUI />
            </PanelHeaderUI>
            {/* <TreeUI shortcut='mod+1' title='Apps' tw='flex-1 overflow-auto' treeView={st.tree1View} /> */}
            <TreeUI //
                shortcut='mod+2'
                title='File Explorer'
                tw='flex-2 overflow-auto'
                treeView={st.tree2View}
            />
        </>
    )
})
