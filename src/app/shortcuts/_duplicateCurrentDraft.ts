import type { STATE } from 'src/state/state'

import { toastError, toastSuccess } from 'src/utils/misc/toasts'

export const _duplicateCurrentDraft = (st: STATE) => {
    const DraftPanelProps = st.layout.currentTabIs('Draft')
    if (DraftPanelProps == null) {
        toastError(`❌ no draft selected to duplicate`)
        console.log(`❌ _duplicateCurrentDraft failed: current tab is not Draft`)
        return
    }
    const draft = st.db.drafts.get(DraftPanelProps.draftID)
    if (draft == null) return console.log(`❌ _duplicateCurrentDraft failed: draft is null`)

    draft.duplicateAndFocus()
    toastSuccess(`✅ draft duplicated`)
}
