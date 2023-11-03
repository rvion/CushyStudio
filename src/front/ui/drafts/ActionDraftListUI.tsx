import { observer } from 'mobx-react-lite'
import { Button, Input, InputGroup } from 'rsuite'
import { CardFile } from 'src/library/CardFile'
import { useSt } from 'src/front/FrontStateCtx'

export const ActionDraftListUI = observer(function ActionDraftListUI_(p: { af: CardFile }) {
    const af = p.af
    const st = useSt()
    const drafts = af.drafts
    return (
        <div className='flex flex-wrap items-center gap-1 mx-2'>
            <Button
                disabled={af.action == null}
                appearance='ghost'
                size='xs'
                style={{
                    borderBottom: 'none',
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                }}
                color='green'
                startIcon={<span className='material-symbols-outlined'>add</span>}
                onClick={() => void af.createDraft()}
            >
                New Draft
            </Button>
            {drafts.map((draft) => {
                const title = draft.data.title || 'Untitled'
                const active = st.layout.currentTab?.getId() === `/draft/${draft.data.id}`
                return (
                    <div key={draft.id} tw='cursor-pointer row'>
                        <InputGroup style={{ borderBottom: 'none', borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
                            <Input
                                onClick={() => st.layout.addDraft(title, draft.id)}
                                tw={[active ? 'bg-gray-700' : null, 'font-mono']}
                                onChange={(next) => draft.update({ title: next })}
                                size='xs'
                                style={{
                                    width: `${title.length + 4}ch`,
                                    borderBottom: 'none',
                                    borderBottomRightRadius: 0,
                                    borderBottomLeftRadius: 0,
                                }}
                                value={title}
                            />
                            <InputGroup.Button
                                tw='p-0 '
                                color='red'
                                appearance='primary'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    draft.delete()
                                    st.layout.closeTab(`/draft/${draft.id}`)
                                    // if (st.layout.currentTabID)
                                }}
                                size='xs'
                                startIcon={<span className='text-red-500 material-symbols-outlined'>close</span>}
                            ></InputGroup.Button>
                        </InputGroup>
                    </div>
                )
            })}
        </div>
    )
})

export const AddDraftUI = observer(function AddDraftUI_(p: { af: CardFile }) {
    const af = p.af
    return (
        <Button
            disabled={af.action == null}
            appearance='subtle'
            size='xs'
            color='green'
            startIcon={<span className='material-symbols-outlined'>add</span>}
            onClick={() => void af.createDraft()}
        >
            New Draft
        </Button>
    )
})
