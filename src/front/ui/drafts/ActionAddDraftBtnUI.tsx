import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { ActionFile } from 'src/back/ActionFile'
import { useProject } from 'src/front/ProjectCtx'

export const ActionAddDraftBtnUI = observer(function ActionAddDraftBtnUI_(p: { af: ActionFile }) {
    const pj = useProject()
    const af = p.af
    const action = af.action
    return (
        <Button
            disabled={action == null}
            appearance='subtle'
            size='xs'
            color='green'
            startIcon={<span className='material-symbols-outlined'>add</span>}
            onClick={() => {
                if (action == null) return
                const draft = pj.db.drafts.create({
                    actionParams: {},
                    actionPath: af.relPath,
                    graphID: pj.rootGraph.id,
                    title: 'Untitled',
                })
            }}
        >
            {/* <I.AddOutline /> */}
            New Draft for ({af.name} ({af.action?.name}))
        </Button>
    )
})
