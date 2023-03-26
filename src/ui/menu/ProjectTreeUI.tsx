import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components'
import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components/unstable'

import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { AssetTreeUI } from './AssetTreeUI'

import { ScriptStep_prompt } from '../../core/ScriptStep_prompt'
import { useWorkspace } from '../WorkspaceContext'
import { ExecutionStepIconUI } from './ExecutionStepIconUI'

export const ProjectTreeUI = observer(function MenuUI_() {
    const workspace = useWorkspace()
    return (
        <Tree
            size='small'
            aria-label='Tree'
            // defaultOpenItems={[
            //     //
            //     'projects',
            //     client.script.id,
            //     client.script.currentRun?.uid ?? 'currentRun',
            // ]}
            ref={(e) => {
                if (e) e.focus()
            }}
        >
            <TreeItem>
                <TreeItemLayout onClick={() => (workspace.focus = 'config')} iconBefore={<I.Options24Filled />}>
                    Config
                </TreeItemLayout>
            </TreeItem>
            <TreeItem>
                <TreeItemLayout onClick={workspace.openCushySDK} iconBefore={<I.BrainCircuit24Filled />}>
                    API Cushy
                </TreeItemLayout>
            </TreeItem>
            <AssetTreeUI>
                {/* <TreeItem> */}
                <TreeItemLayout onClick={workspace.openComfySDK} iconBefore={<I.BrainCircuit24Regular />}>
                    API Comfy
                </TreeItemLayout>
                {/* </TreeItem> */}
            </AssetTreeUI>
            {/* <TreeItem id='projects'>
                <TreeItemLayout iconBefore={<I.DocumentBulletListMultiple24Regular />}>Scripts</TreeItemLayout>
                <Tree> */}
            {workspace.scripts.map((project) => (
                <TreeItem
                    // PROJECT
                    id={project.id}
                    key={project.id}
                    actions={
                        <>
                            <Button onClick={() => project.RUN('real')} appearance='subtle' icon={<I.Play24Filled />} />
                            <Menu>
                                <MenuTrigger disableButtonEnhancement>
                                    <Button appearance='subtle' icon={<I.MoreHorizontal20Regular />} />
                                </MenuTrigger>

                                <MenuPopover>
                                    <MenuList>
                                        <MenuItem>New </MenuItem>
                                        <MenuItem>New Window</MenuItem>
                                        <MenuItem disabled>Open File</MenuItem>
                                        <MenuItem>Open Folder</MenuItem>
                                    </MenuList>
                                </MenuPopover>
                            </Menu>
                        </>
                    }
                >
                    <TreeItemLayout
                        iconBefore={<I.DocumentBulletList24Filled />}
                        onClick={() => project.openInEditor()}
                        // aside={<RenderAside />}
                    >
                        {project.folderName}
                    </TreeItemLayout>
                    <Tree>
                        {project.runs.map((run, ix) => (
                            <TreeItem id={run.uid} key={run.uid} actions={<Actions />}>
                                <TreeItemLayout
                                    //
                                    iconBefore={<I.PlayCircle24Regular />}
                                    // aside={<RenderAside />}
                                >
                                    Run {ix + 1}
                                </TreeItemLayout>
                                <Tree>
                                    {run.steps.map((step, ix) => (
                                        <TreeItem key={ix} actions={<Actions />}>
                                            <TreeItemLayout iconBefore={ExecutionStepIconUI(step)}>{step.name}</TreeItemLayout>
                                            {step instanceof ScriptStep_prompt ? (
                                                <Tree>
                                                    {run.graph.nodes.map((node, ix) => (
                                                        <TreeItem key={ix} actions={<Actions />}>
                                                            <TreeItemLayout
                                                                //
                                                                iconBefore={<I.Cube16Regular />}
                                                                aside={<RenderAside />}
                                                            >
                                                                {ix + 1}. {node.$schema.name}
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
                </TreeItem>
            ))}
            {/* <TreeItem>
                        <TreeItemLayout aside={<RenderAside />}>level 2, item 2</TreeItemLayout>
                    </TreeItem>
                    <TreeItem actions={<Actions />}>
                        <TreeItemLayout aside={<RenderAside />}>level 2, item 3</TreeItemLayout>
                    </TreeItem> */}
            {/* </Tree> */}
            {/* // </TreeItem> */}

            {/* SERVER */}
            {/* <TreeItem actions={<Actions />}>
                <TreeItemLayout iconBefore={<I.Server24Filled />} aside={client.wsStatus === 'on' ? IsOK : HasProblem}>
                    Server
                </TreeItemLayout>
                <Tree>
                    <TreeItem
                        actions={
                            <Popover positioning={'above-start'}>
                                <PopoverTrigger>
                                    <Button appearance='subtle' icon={<I.Edit20Regular />} />
                                </PopoverTrigger>
                                <PopoverSurface>
                                    <Input
                                        type='text'
                                        value={client.serverIP}
                                        onChange={(e) => (client.serverIP = e.target.value)}
                                    ></Input>
                                </PopoverSurface>
                            </Popover>
                        }
                    >
                        <TreeItemLayout iconBefore={<I.Server24Filled />}>IP: {client.serverIP}</TreeItemLayout>
                    </TreeItem>
                    <TreeItem>
                        <TreeItemLayout iconBefore={<I.Server24Filled />}>Port: {client.serverPort}</TreeItemLayout>
                    </TreeItem>
                </Tree>
            </TreeItem> */}
        </Tree>
    )
})

export const HasProblem = <I.Important16Regular primaryFill='red' />
export const IsOK = <I.CheckmarkCircle16Regular primaryFill='green' />

const RenderAside = () => (
    <>
        <I.Important16Regular {...iconStyleProps} />
        {/* <CounterBadge count={1} color='danger' size='small' /> */}
    </>
)

export const Actions = () => (
    <>
        <Button appearance='subtle' icon={<I.Edit20Regular />} />
        <Button appearance='subtle' icon={<I.MoreHorizontal20Regular />} />
    </>
)
const iconStyleProps: I.FluentIconsProps = { primaryFill: 'red' }
