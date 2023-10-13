import type { DraftL } from 'src/models/Draft'
import type { ToolL } from 'src/models/Tool'

import { observer } from 'mobx-react-lite'
import { useProject } from 'src/front/ProjectCtx'
import { ActionAddDraftBtnUI } from './ActionAddDraftBtnUI'

export const ActionDraftListUI = observer(function ActionDraftListUI_(p: { tool: ToolL }) {
    const pj = useProject()
    const graph = pj.rootGraph.item
    const tool = p.tool
    const focusedDraft: Maybe<DraftL> = tool?.focusedDraft.item
    return (
        <div className='flex flex-col flex-wrap'>
            {tool
                ? tool.drafts.map((draft) => (
                      <div
                          key={draft.id}
                          tw='cursor-pointer pl-8 pr-4 row'
                          style={{
                              background: focusedDraft?.id === draft.id ? '#333' : undefined,
                              color: focusedDraft?.id === draft.id ? 'violet' : undefined,
                          }}
                          onClick={() => {
                              tool.update({ focusedDraftID: draft.id })
                              graph.update({ focusedDraftID: draft.id })
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

                          {/* {draft.tool.item.name} */}
                      </div>
                  ))
                : null}
            <ActionAddDraftBtnUI tool={p.tool} />
        </div>
    )
})
