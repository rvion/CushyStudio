import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components/unstable'
import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { ScriptStep_prompt } from '../controls/ScriptStep_prompt'
import { useWorkspace } from '../ui/WorkspaceContext'
import { ControlIconUI } from './ControlIconUI'
import { Actions } from './ProjectTreeUI'

export const FocusedProjectTreeUI = observer(function FocusedProjectTreeUI_(p: {}) {
    const project = useWorkspace().focusedProject
    if (!project) return null
    return (
        <div>
            🟢 {project.name}
            <Tree>
                {project.runs.map((run, ix) => (
                    <TreeItem id={run.uid} key={run.uid} actions={<Actions />}>
                        <TreeItemLayout iconBefore={<I.PlayCircle24Regular />}>Run {ix + 1}</TreeItemLayout>
                        <Tree>
                            {run.steps.map((step, ix) => (
                                <TreeItem key={ix} actions={<Actions />}>
                                    <TreeItemLayout iconBefore={ControlIconUI(step)}>{step.name}</TreeItemLayout>
                                    {step instanceof ScriptStep_prompt ? (
                                        <Tree>
                                            {run.graph.nodes.map((node, ix) => (
                                                <TreeItem key={ix} actions={<Actions />}>
                                                    <TreeItemLayout iconBefore={<I.Cube16Regular />}>
                                                        {ix + 1}. {node.$schema.nameInComfy}
                                                    </TreeItemLayout>
                                                </TreeItem>
                                            ))}
                                        </Tree>
                                    ) : null}
                                </TreeItem>
                            ))}
                        </Tree>
                    </TreeItem>
                ))}
            </Tree>
        </div>
    )
})
