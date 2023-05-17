import { observer } from 'mobx-react-lite'
import { Form, Input, Panel } from 'rsuite'
import { useFlow } from '../../front/FrontFlowCtx'
import { ActionPickerUI } from '../flow/ActionPickerUI'

export const WorkflowUI = observer(function WorkflowUI_(p: {}) {
    const flow = useFlow()
    return (
        <Panel>
            <Input placeholder='workflow name' name='title' />
            <div className='flex gap-2'>
                <ActionPickerUI actionFront={flow.draft} />
                {flow.groupper.msgGroups.map((group, groupIx) => {
                    return (
                        <div
                            //
                            key={groupIx}
                            className={`relative [width:100%] group-of-${group.groupType}`}
                            style={{
                                overflowX: 'auto',
                            }}
                        >
                            <div style={{ flexWrap: group.wrap ? 'wrap' : undefined }} className='flex row gap-2'>
                                {group.uis}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Panel>
    )
})
