import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { ActionFile } from 'src/back/ActionFile'
import { useSt } from 'src/front/FrontStateCtx'

export const ActionDraftListUI = observer(function ActionDraftListUI_(p: { af: ActionFile }) {
    const af = p.af
    const st = useSt()
    const drafts = af.drafts
    return (
        <div className='flex flex-wrap items-center gap-1'>
            {drafts.map((draft) => {
                const title = draft.data.title || 'Untitled'
                return (
                    <Button
                        startIcon={<span className='material-symbols-outlined'>build_circle</span>}
                        key={draft.id}
                        tw='cursor-pointer row'
                        size='sm'
                        onClick={() => st.layout.addDraft(title, draft.id)}
                    >
                        {title}
                    </Button>
                )
            })}

            <Button
                disabled={af.action == null}
                appearance='primary'
                size='sm'
                color='green'
                startIcon={<span className='material-symbols-outlined'>add</span>}
                onClick={() => void af.createDraft()}
            >
                New Draft
            </Button>
        </div>
    )
})
