import { observer } from 'mobx-react-lite'
import { Message } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { DraftID } from 'src/models/Draft'
import { ActionFormUI } from './ActionFormUI'

export const DraftUI = observer(function DraftUI_(p: { draftID: DraftID }) {
    const st = useSt()

    // 1. get draft
    const draft = st.db.drafts.get(p.draftID)
    if (draft == null) return <>❌ draft not found</>

    // 2. get action
    // const actionFile = draft.actionFile
    // 🔴
    // if (action.errors) {
    //     return (
    //         <Message type='error'>
    //             <pre tw='bg-red-900'>{JSON.stringify(af.errors, null, 4)}</pre>
    //         </Message>
    //     )
    // }
    // const tool = toolsR.value[0]
    // const focusedDraft: Maybe<DraftL> = tool?.focusedDraft.item
    // if (focusedDraft == null) return <>no draft selected</>
    return <ActionFormUI draft={draft} />
})
