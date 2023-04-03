import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components'
import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components/unstable'

import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'

import { useWorkspace } from '../ui/WorkspaceContext'

export const ProjectTreeUI = observer(function MenuUI_() {
    const workspace = useWorkspace()
    return (
        <Tree
            size='small'
            aria-label='Tree'
            defaultOpenItems={['projects', 'demos']}
            ref={(e) => {
                if (e) e.focus()
            }}
        >
            <TreeItem>
                <TreeItemLayout
                    iconAfter={
                        workspace.ws.isOpen ? <I.CheckmarkCircle24Filled color='green' /> : <I.ErrorCircle24Regular color='red' />
                    }
                    onClick={() => (workspace.focusedFile = null)}
                    iconBefore={<I.Options24Filled />}
                >
                    Connection
                </TreeItemLayout>
            </TreeItem>
            <TreeItem>
                <TreeItemLayout onClick={workspace.openCushySDK} iconBefore={<I.BrainCircuit24Filled />}>
                    API Cushy
                </TreeItemLayout>
            </TreeItem>
            <TreeItem>
                <TreeItemLayout onClick={workspace.openComfySDK} iconBefore={<I.BrainCircuit24Regular />}>
                    API Comfy
                </TreeItemLayout>
            </TreeItem>
            <TreeItem id='demos'>
                <TreeItemLayout iconBefore={<I.BuildingBank24Regular />}>Démos</TreeItemLayout>
                <Tree>
                    {workspace.demos.map((demo, ix) => (
                        <TreeItem
                            // PROJECT
                            id={demo.name}
                            key={demo.name}
                        >
                            <TreeItemLayout
                                iconBefore={<I.DesignIdeas24Filled />}
                                onClick={() => demo.createProjectCopy(workspace)}
                            >
                                <span>{demo.name}</span>
                            </TreeItemLayout>
                        </TreeItem>
                    ))}
                </Tree>
            </TreeItem>
            <TreeItem id='projects'>
                <TreeItemLayout iconBefore={<I.DocumentBulletListMultiple24Regular />}>Scripts</TreeItemLayout>
                <Tree>
                    {workspace.projects
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((project) => (
                            <TreeItem
                                // PROJECT
                                id={project.id}
                                key={project.id}
                                actions={
                                    <>
                                        <Button
                                            onClick={() => project.RUN('real')}
                                            appearance='subtle'
                                            icon={<I.Play24Filled />}
                                        />
                                        <Menu>
                                            <MenuTrigger disableButtonEnhancement>
                                                <Button appearance='subtle' icon={<I.MoreHorizontal20Regular />} />
                                            </MenuTrigger>

                                            <MenuPopover>
                                                <MenuList>
                                                    <MenuItem icon={<I.BranchFork24Filled />} onClick={() => project.duplicate()}>
                                                        Duplicate
                                                    </MenuItem>
                                                    <MenuItem icon={<I.Play24Filled />} onClick={() => project.RUN()}>
                                                        Run
                                                    </MenuItem>
                                                </MenuList>
                                            </MenuPopover>
                                        </Menu>
                                    </>
                                }
                            >
                                <TreeItemLayout
                                    iconBefore={<I.DocumentBulletList24Filled />}
                                    onClick={() => project.focus()}
                                    // aside={<RenderAside />}
                                >
                                    <span
                                        style={
                                            workspace.focusedProject === project
                                                ? {
                                                      backgroundColor: 'rgb(72, 34, 92)',
                                                      boxShadow: '0 0 2px 2px rgb(72, 34, 92)',
                                                  }
                                                : undefined
                                        }
                                    >
                                        {project.name}
                                    </span>
                                </TreeItemLayout>
                            </TreeItem>
                        ))}
                    {/* </TreeItem> */}
                    {/* <TreeItemLayout aside={<RenderAside />}>level 2, item 2</TreeItemLayout>
                    </TreeItem>
                    <TreeItem actions={<Actions />}>
                        <TreeItemLayout aside={<RenderAside />}>level 2, item 3</TreeItemLayout>
                    </TreeItem> */}
                </Tree>
            </TreeItem>

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
