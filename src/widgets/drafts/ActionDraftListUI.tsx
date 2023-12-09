import { observer } from 'mobx-react-lite'
import { LibraryFile } from 'src/cards/LibraryFile'
import { Button, Input } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

export const ActionDraftListUI = observer(function ActionDraftListUI_(p: { card: LibraryFile }) {
    const card = p.card
    const st = useSt()
    const drafts = card.drafts
    return (
        <div className='flex flex-wrap items-center gap-1 mx-2'>
            <Button
                disabled={card.appCompiled == null}
                appearance='ghost'
                size='xs'
                style={{
                    borderBottom: 'none',
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                }}
                color='green'
                icon={<span className='material-symbols-outlined'>add</span>}
                onClick={() => void card.createDraft()}
            >
                New Draft
            </Button>
            {drafts.map((draft) => {
                const title = draft.data.title || 'Untitled'
                const active = st.layout.currentTab?.getId() === `/draft/${draft.data.id}`
                return (
                    <div key={draft.id} tw='cursor-pointer row'>
                        <div tw='join' style={{ borderBottom: 'none', borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
                            <Input
                                value={title}
                                onClick={() => st.layout.FOCUS_OR_CREATE('Draft', { draftID: draft.id })}
                                tw={[active ? 'bg-gray-700' : null, 'font-mono', 'join-item input-xs']}
                                style={{
                                    width: `${title.length + 4}ch`,
                                    borderBottom: 'none',
                                    borderBottomRightRadius: 0,
                                    borderBottomLeftRadius: 0,
                                }}
                                onChange={(ev) => {
                                    const next = ev.target.value
                                    draft.update({ title: next })
                                }}
                            />
                            <Button
                                tw='p-0 join-item'
                                color='red'
                                appearance='primary'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    if (st.currentDraft?.id === draft.id) st.currentDraft = null
                                    draft.delete()
                                    st.layout.closeTab(`/draft/${draft.id}`)
                                    // if (st.layout.currentTabID)
                                }}
                                size='xs'
                                icon={<span className='text-red-500 material-symbols-outlined'>close</span>}
                            ></Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
})
