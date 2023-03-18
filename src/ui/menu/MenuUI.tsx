import {
    Avatar,
    Button,
    Input,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Popover,
    PopoverSurface,
    PopoverTrigger,
} from '@fluentui/react-components'
import { Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout } from '@fluentui/react-components/unstable'

import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { AssetTreeUI } from './AssetTreeUI'

import { useSt } from '../stContext'

const iconStyleProps: I.FluentIconsProps = {
    primaryFill: 'red',
}

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

export const MenuUI = observer(function MenuUI_() {
    const client = useSt()
    return (
        <Tree
            aria-label='Tree'
            defaultOpenItems={['projects', client.project.id]}
            ref={(e) => {
                if (e) e.focus()
            }}
        >
            {/* USER PREFERENCES */}
            {/* <TreeItem>
                <TreeItemPersonaLayout media={<Avatar />}>content</TreeItemPersonaLayout>
            </TreeItem> */}

            {/* PROJECTS */}
            <TreeItem id='projects'>
                <TreeItemLayout
                    iconBefore={<I.DocumentBulletListMultiple24Regular />}
                    // aside={<RenderAside />}
                >
                    Projects
                </TreeItemLayout>
                <Tree>
                    {client.projects.map((project) => (
                        <TreeItem
                            // PROJECT
                            id={project.id}
                            key={project.id}
                            actions={
                                <>
                                    <Button onClick={() => project.run('real')} appearance='subtle' icon={<I.Play24Filled />} />
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
                                //
                                iconBefore={<I.DocumentBulletList24Filled />}
                                // aside={<RenderAside />}
                            >
                                {project.name}
                            </TreeItemLayout>
                            <Tree>
                                {project.runs.map((run, ix) => (
                                    <TreeItem key={ix} actions={<Actions />}>
                                        <TreeItemLayout
                                            //
                                            iconBefore={<I.CubeTree24Filled />}
                                            // aside={<RenderAside />}
                                        >
                                            Run {ix + 1}
                                        </TreeItemLayout>
                                        <Tree>
                                            {run.steps.map((step, ix) => (
                                                <TreeItem key={ix} actions={<Actions />}>
                                                    <TreeItemLayout
                                                        //
                                                        iconBefore={<I.Cube16Regular />}
                                                        aside={<RenderAside />}
                                                    >
                                                        {step.name}
                                                    </TreeItemLayout>
                                                </TreeItem>
                                            ))}
                                        </Tree>
                                    </TreeItem>
                                ))}
                                {/*
                                // {project.graphs.map((graph, ix) => (
                                //     <TreeItem key={ix} actions={<Actions />}>
                                //         <TreeItemLayout
                                //             //
                                //             iconBefore={<I.CubeTree24Filled />}
                                //             // aside={<RenderAside />}
                                //         >
                                //             Graph {ix + 1}
                                //         </TreeItemLayout>
                                //         <Tree>
                                //             {graph.nodesArray.map((node, ix) => (
                                //                 <TreeItem key={ix} actions={<Actions />}>
                                //                     <TreeItemLayout
                                //                         //
                                //                         iconBefore={<I.Cube16Regular />}
                                //                         aside={<RenderAside />}
                                //                     >
                                //                         Node {ix + 1}
                                //                     </TreeItemLayout>
                                //                 </TreeItem>
                                //             ))}
                                //         </Tree>
                                //     </TreeItem>
                                // ))}
                                */}
                            </Tree>
                        </TreeItem>
                    ))}
                    {/* <TreeItem>
                        <TreeItemLayout aside={<RenderAside />}>level 2, item 2</TreeItemLayout>
                    </TreeItem>
                    <TreeItem actions={<Actions />}>
                        <TreeItemLayout aside={<RenderAside />}>level 2, item 3</TreeItemLayout>
                    </TreeItem> */}
                </Tree>
            </TreeItem>

            {/* SERVER */}
            <TreeItem actions={<Actions />}>
                <TreeItemLayout iconBefore={<I.Server24Filled />} aside={client.wsStatus === 'on' ? IsOK : HasProblem}>
                    Server
                </TreeItemLayout>
                <Tree>
                    {/* {client.projects.map((p) => (
                        <TreeItem key={p.id} actions={<Actions />}>
                            <TreeItemLayout aside={<RenderAside />}>{p.name}</TreeItemLayout>
                        </TreeItem>
                    ))} */}
                    <TreeItem
                        actions={
                            //
                            <Popover positioning={'above-start'}>
                                <PopoverTrigger>
                                    <Button appearance='subtle' icon={<I.Edit20Regular />} />
                                    {/* <Button>trigger</Button> */}
                                </PopoverTrigger>
                                <PopoverSurface>
                                    <Input
                                        type='text'
                                        value={client.serverIP}
                                        onChange={(e) => (client.serverIP = e.target.value)}
                                    ></Input>
                                </PopoverSurface>
                            </Popover>

                            // <Actions />
                        }
                    >
                        <TreeItemLayout iconBefore={<I.Server24Filled />}>IP: {client.serverIP}</TreeItemLayout>
                    </TreeItem>
                    <TreeItem actions={<Actions />}>
                        <TreeItemLayout iconBefore={<I.Server24Filled />}>Port: {client.serverPort}</TreeItemLayout>
                    </TreeItem>
                </Tree>
            </TreeItem>

            {/* GUI */}
            <TreeItem /*actions={<Actions />}*/>
                <TreeItemLayout
                    // aside={<RenderAside />}
                    iconBefore={<I.EmojiSparkle24Regular />}
                >
                    GUI
                </TreeItemLayout>
                <Tree>
                    <TreeItem /*actions={<Actions />}*/>
                        <TreeItemLayout
                        // aside={<RenderAside />}
                        >
                            Monaco
                        </TreeItemLayout>
                    </TreeItem>
                </Tree>
            </TreeItem>
            <AssetTreeUI />
        </Tree>
    )
})
