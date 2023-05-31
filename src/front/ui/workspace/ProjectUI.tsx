import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Input, Panel } from 'rsuite'
import { useProject } from '../../ProjectCtx'
import { ActionPickerUI } from '../flow/ActionPickerUI'
import { StepUI } from '../widgets/FormUI'

export const ProjectUI = observer(function ProjectUI_(p: {}) {
    const project = useProject()
    return (
        <Panel>
            <div className='row'>
                <IconButton onClick={() => project.delete()} icon={<I.Trash />} />
                <Input
                    value={project.data.name}
                    onChange={(next) => project.update({ name: next })}
                    placeholder='Project name'
                    name='title'
                />
            </div>
            <div className='row'>
                <div className='flex flex-col gap-2'>
                    {project.steps.map((step) => {
                        return (
                            <div key={step.id} className='row'>
                                <ActionPickerUI step={step} />
                                <div>
                                    from (id={step.graph.id.slice(0, 3)}--{step.graph.item.size})
                                    <ul>
                                        {step.graph.item.summary1.map((i, ix) => (
                                            <li key={ix}>{i}</li>
                                        ))}
                                    </ul>
                                </div>
                                <StepUI key={step.id} step={step} />
                                <div>
                                    <Button onClick={() => step.submit()}>OK</Button>
                                    <div>
                                        to (id={step.runtime?.graph.id.slice(0, 3)}--{step.runtime?.graph.size}){' '}
                                    </div>
                                </div>
                                {/* <div>{step.runtime}</div> */}
                            </div>
                        )
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
