import { observer } from 'mobx-react-lite'
import { useSt } from '../../front/FrontStateCtx'
import { flowContext, useFlow } from '../../front/FrontFlowCtx'
import { ActionPickerUI } from '../flow/ActionPickerUI'
import { Button, Panel } from 'rsuite'

export const WorkspaceUI = observer(function WorkspaceUI_(p: {}) {
    const st = useSt()
    return (
        <div className='flex flex-col gap-4 p-4'>
            <Button appearance='primary' className='self-start' onClick={() => st.startFlow()}>
                Start Flow
            </Button>
            {st.flowArray.map((flow) => {
                return (
                    <flowContext.Provider value={flow} key={flow.id}>
                        <FlowUI key={flow.id} />
                    </flowContext.Provider>
                )
            })}
        </div>
    )
})

export const FlowUI = observer(function FlowUI_(p: {}) {
    const flow = useFlow()
    return (
        <Panel>
            <div className='flex flex-col gap-2 p-2'>
                {flow.groupper.msgGroups.map((group, groupIx) => {
                    return (
                        <div key={groupIx} className='relative [width:100%]' style={{ overflowX: 'auto' }}>
                            <div style={{ flexWrap: group.wrap ? 'wrap' : undefined }} className='flex row gap-2'>
                                {group.uis}
                            </div>
                        </div>
                    )
                })}
                <ActionPickerUI actionFront={flow.draft} />
            </div>
        </Panel>
    )
})
