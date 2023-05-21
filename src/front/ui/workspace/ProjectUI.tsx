import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton, Input, Panel } from 'rsuite'
import { useProject } from '../../ProjectCtx'
import { ActionPickerUI } from '../flow/ActionPickerUI'
import { StepUI } from '../widgets/FormUI'
export const WorkflowUI = observer(function WorkflowUI_(p: {}) {
    const project = useProject()
    return (
        <Panel>
            <div className='row'>
                <IconButton onClick={() => project.delete()} icon={<I.Trash />} />
                <Input
                    value={project.data.name}
                    onChange={(next) => {
                        project.update({ name: next })
                    }}
                    placeholder='Project name'
                    name='title'
                />
            </div>
            <div className='row'>
                <ActionPickerUI step={project.lastStep} />
                <div className='flex flex-col gap-2'>
                    {project.steps.map((step) => {
                        return <StepUI key={step.id} step={step} />
                    })}
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
            </div>
        </Panel>
    )
})
