import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { useProject } from 'src/front/ProjectCtx'
import { ToolL } from 'src/models/Tool'

export const ActionAddDraftBtnUI = observer(function ActionAddDraftBtnUI_(p: { tool: ToolL }) {
    const pj = useProject()
    const tool = p.tool
    return (
        <Button
            disabled={tool == null}
            //
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
                if (tool == null) return
                const draft = pj.db.drafts.create({
                    toolID: tool.id,
                    graphID: pj.rootGraph.id,
                    title: 'Untitled',
                    params: {},
                    // params: deepCopyNaive(fromDraft?.params ?? {}),
                })
                tool.update({ focusedDraftID: draft.id })
            }}
        >
            {/* <I.AddOutline /> */}
            New Draft
        </Button>
    )
})
