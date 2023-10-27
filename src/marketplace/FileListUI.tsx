import { observer } from 'mobx-react-lite'
import { useSt } from '../front/FrontStateCtx'
import { TabUI } from '../front/ui/layout/TabUI'
import { ActionPicker1UI } from './ActionPicker1UI'
import { ActionPicker2UI } from './ActionPicker2UI'

export const FileListUI = observer(function FileListUI_(p: {}) {
    const st = useSt()
    const tb = st.toolbox
    return (
        <>
            <TabUI>
                <div>Actions</div>
                <ActionPicker2UI />
                <div>Files</div>
                <ActionPicker1UI />
            </TabUI>
        </>
    )
})
