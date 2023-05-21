import { observer } from 'mobx-react-lite'
import { Form, IconButton, Input, Panel } from 'rsuite'
import { useProject } from '../../ProjectCtx'
import { ActionPickerUI } from '../flow/ActionPickerUI'
import * as I from '@rsuite/icons'
export const WorkflowUI = observer(function WorkflowUI_(p: {}) {
    const project = useProject()
    return (
        <Panel>
            <div className='row'>
                <IconButton onClick={() => project.delete()} icon={<I.Trash />} />
                <Input placeholder='workflow name' name='title' />
            </div>
            <div className='flex gap-2'>
                <ActionPickerUI step={project.rootStep} />
                {/* {project.groupper.msgGroups.map((group, groupIx) => {
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
                })} */}
            </div>
        </Panel>
    )
})
