import type { DraftL } from 'src/models/Draft'

import { observer } from 'mobx-react-lite'
import { useProject } from 'src/front/ProjectCtx'
import { ActionAddDraftBtnUI } from './ActionAddDraftBtnUI'
import { ActionFile } from 'src/back/ActionFile'

export const ActionDraftListUI = observer(function ActionDraftListUI_(p: { af: ActionFile }) {
    const pj = useProject()
    const af = p.af
    const drafts = af.drafts
    const focusedDraft = af.focusedDraft
    return (
        <div className='flex flex-col flex-wrap'>
            <div>{drafts.length}drafts</div>
            {drafts.map((draft) => (
                <div
                    key={draft.id}
                    tw='cursor-pointer pl-8 pr-4 row'
                    style={{
                        background: focusedDraft?.id === draft.id ? '#333' : undefined,
                        color: focusedDraft?.id === draft.id ? 'violet' : undefined,
                    }}
                    onClick={() => {
                        af.focusedDraft = draft
                        // tool.update({ focusedDraftID: draft.id })
                        // graph.update({ focusedDraftID: draft.id })
                    }}
                >
                    {/* ▸  */}
                    <span className='material-symbols-outlined'>repeat_one</span>
                    <input
                        type='text'
                        tw='border-none bg-transparent'
                        value={draft.data.title || 'Untitled'}
                        onChange={(ev) => draft.update({ title: ev.target.value })}
                    />
                </div>
            ))}

            <ActionAddDraftBtnUI af={p.af} />
        </div>
    )
})
