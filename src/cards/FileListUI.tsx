import { observer } from 'mobx-react-lite'
import { useSt } from '../front/FrontStateCtx'
import { TabUI } from '../front/ui/layout/TabUI'
import { ActionPicker1UI } from './CardPicker1UI'
import { ActionPicker2UI } from './CardPicker2UI'

export const FileListUI = observer(function FileListUI_(p: {}) {
    const st = useSt()
    const tb = st.library
    return (
        <>
            <TabUI>
                <div>Cards</div>
                <ActionPicker2UI />
                <div>Files</div>
                <ActionPicker1UI />
            </TabUI>
        </>
    )
})
