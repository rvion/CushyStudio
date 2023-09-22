import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { DraftL } from 'src/models/Draft'

/** suggest a tool for the given draft */
export const ToolSuggestionUI = observer(function ActionSuggestionUI_(p: { draft: DraftL }) {
    const st = useSt()
    const draft = p.draft
    if (draft.tool.item.name !== '--') return null
    return (
        <div className='flex gap-1 items-baseline flex-wrap'>
            suggestions:
            {st.toolsSorted.slice(0, 8 /* 🔴 */).map((a) => {
                return (
                    <Button
                        //
                        key={a.id}
                        size='xs'
                        appearance='ghost'
                        onClick={() => draft.update({ toolID: a.id })}
                    >
                        <div>{a.data.name}</div>
                    </Button>
                )
            })}
        </div>
    )
})
