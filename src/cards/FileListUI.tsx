import { observer } from 'mobx-react-lite'
import { useSt } from '../state/stateContext'
import { TabUI } from '../app/layout/TabUI'
import { Panel_FileTree } from '../panels/Panel_FileTree'
import { Panel_DeckList } from '../panels/Panel_DeckList'

export const FileListUI = observer(function FileListUI_(p: {}) {
    const st = useSt()
    const tb = st.library
    return (
        <>
            <TabUI>
                <div>Cards</div>
                <Panel_DeckList />
                <div>Files</div>
                <Panel_FileTree />
            </TabUI>
        </>
    )
})
