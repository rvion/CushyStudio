import { observer } from 'mobx-react-lite'
import { Panel_DeckList } from '../panels/Panel_DeckList'
import { Panel_FileTree } from '../panels/Panel_FileTree'
import { useSt } from '../state/stateContext'

export const FileListUI = observer(function FileListUI_(p: {}) {
    const st = useSt()
    return (
        <>
            <div tw='tabs tabs-lifted'>
                <input type='radio' name='Cards' tw='tab' />
                <div tw='tab-content bg-base-100 border-base-300 rounded-box p-10'>
                    <Panel_DeckList />
                </div>
                <input type='radio' name='Files' tw='tab' />
                <div tw='tab-content bg-base-100 border-base-300 rounded-box p-10'>
                    <Panel_FileTree />
                </div>
            </div>
        </>
    )
})
