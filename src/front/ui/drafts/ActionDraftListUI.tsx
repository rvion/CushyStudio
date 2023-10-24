import { observer } from 'mobx-react-lite'
import { Button, Input } from 'rsuite'
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
                    <div key={draft.id} tw='cursor-pointer row' onClick={() => st.layout.addDraft(title, draft.id)}>
                        <Input
                            style={{
                                borderBottom: 'none',
                                borderBottomRightRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                            value={title}
                            onChange={(next) => draft.update({ title: next })}
                        />
                    </div>
                )
            })}

            {/* <Button
                disabled={af.action == null}
                appearance='primary'
                size='sm'
                color='green'
                startIcon={<span className='material-symbols-outlined'>add</span>}
                onClick={() => void af.createDraft()}
            >
                New Draft
            </Button> */}
        </div>
    )
})

export const AddDraftUI = observer(function AddDraftUI_(p: { af: ActionFile }) {
    const af = p.af
    return (
        <Button
            disabled={af.action == null}
            appearance='primary'
            size='xs'
            color='green'
            startIcon={<span className='material-symbols-outlined'>add</span>}
            onClick={() => void af.createDraft()}
        >
            New Draft
        </Button>
    )
})
