import { observer } from 'mobx-react-lite'
import { useProject } from 'src/front/ProjectCtx'
import { ActionFile } from 'src/back/ActionFile'
import { Button } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { generateName } from './generateName'

export const ActionDraftListUI = observer(function ActionDraftListUI_(p: { af: ActionFile }) {
    const af = p.af
    const st = useSt()
    const drafts = af.drafts
    // const focusedDraft = af.focusedDraft

    /*
        <input
            type='text'
            tw='border-none bg-transparent'
            value={draft.data.title || 'Untitled'}
            onChange={(ev) => draft.update({ title: ev.target.value })}
        />
    */

    return (
        <div className='flex flex-wrap items-center gap-1'>
            {/* <div>{drafts.length}drafts</div> */}
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

            <ActionAddDraftBtnUI af={p.af} />
        </div>
    )
})

export const ActionAddDraftBtnUI = observer(function ActionAddDraftBtnUI_(p: { af: ActionFile }) {
    const pj = useProject()
    const st = useSt()
    const af = p.af
    const action = af.action
    return (
        <Button
            disabled={action == null}
            appearance='primary'
            size='sm'
            color='green'
            startIcon={<span className='material-symbols-outlined'>add</span>}
            onClick={() => {
                if (action == null) return
                const title = generateName()
                const draft = pj.db.drafts.create({
                    actionParams: {},
                    actionPath: af.relPath,
                    graphID: pj.rootGraph.id,
                    title: title,
                })
                pj.st.layout.addDraft(draft.data.title, draft.id)
            }}
        >
            New Draft
        </Button>
    )
})
