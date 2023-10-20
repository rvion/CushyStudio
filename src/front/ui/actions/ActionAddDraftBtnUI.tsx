import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { ActionFile } from 'src/back/ActionFile'
import { useProject } from 'src/front/ProjectCtx'

export const ActionAddDraftBtnUI = observer(function ActionAddDraftBtnUI_(p: { af: ActionFile }) {
    const pj = useProject()
    const af = p.af
    const action = af.action
    // const tool = p.tool
    return (
        <Button
            disabled={action == null}
            appearance='subtle'
            size='xs'
            color='green'
            startIcon={<span className='material-symbols-outlined'>add</span>}
            // code to duplicate the draft
            style={
                {
                    // borderBottomLeftRadius: 0,
                    // borderBottomRightRadius: 0,
                    // borderBottom: 'none',
                }
            }
            onClick={() => {
                if (action == null) return
                const draft = pj.db.drafts.create({
                    actionParams: {},
                    actionPath: af.relPath,
                    // toolID: tool.id,
                    graphID: pj.rootGraph.id,
                    title: 'Untitled',
                })
                tool.update({ focusedDraftID: draft.id })
            }}
        >
            {/* <I.AddOutline /> */}
            New Draft
        </Button>
    )
})
