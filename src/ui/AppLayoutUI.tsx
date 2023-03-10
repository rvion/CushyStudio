import { observer } from 'mobx-react-lite'
import DockLayout, { LayoutData } from 'rc-dock'
import { ArtifactsUI } from './ArtifactsUI'
import { ComfyCodeEditorUI } from './ComfyCodeEditorUI'
import { NodeListUI } from './NodeListUI'
import { IdeInfosUI } from './IdeInfosUI'
import { ProjectInfosUI } from './ProjectInfosUI'
import { VisUI } from './VisUI'

export const AppLayoutUI = observer(function AppLayoutUI_(p: {}) {
    return <DockLayout defaultLayout={defaultLayout()} style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} />
})

const defaultLayout = (): LayoutData => ({
    dockbox: {
        mode: 'horizontal',
        children: [
            {
                mode: 'vertical',
                children: [
                    {
                        tabs: [
                            {
                                minWidth: 180,
                                minHeight: 200,
                                id: 'ide',
                                title: 'IDE',
                                content: <IdeInfosUI />,
                            },
                        ],
                    },
                    {
                        size: 9999,
                        tabs: [
                            {
                                minWidth: 280,
                                id: 'assets',
                                title: 'Assets',
                                content: (
                                    <>
                                        {/* <MainActionsUI />
                                        <VersionPickerUI />
                                        <NodeListUI /> */}
                                    </>
                                ),
                            },
                        ],
                    },
                ],
            },

            {
                mode: 'vertical',
                minWidth: 180,
                children: [
                    {
                        tabs: [
                            {
                                minHeight: 200,
                                id: 'project-infos',
                                title: 'Project',
                                content: <ProjectInfosUI />,
                            },
                        ],
                    },
                    {
                        size: 9999,
                        tabs: [
                            {
                                minWidth: 280,
                                id: 'nodes',
                                title: 'Node List',
                                content: (
                                    <>
                                        {/* <VersionPickerUI /> */}
                                        <NodeListUI />
                                    </>
                                ),
                            },
                        ],
                    },
                ],
            },
            {
                mode: 'vertical',
                size: 9999,
                children: [
                    {
                        // mode: 'vertical',
                        size: 99999,
                        tabs: [
                            { id: 'Editor1', title: 'Script', content: <ComfyCodeEditorUI /> },
                            { id: 'Editor2', title: 'dts', content: <ComfyCodeEditorUI /> },
                            { id: 'Editor3', title: 'object_infos', content: <ComfyCodeEditorUI /> },
                        ],
                    },
                    {
                        // mode: 'vertical',
                        tabs: [
                            {
                                minHeight: 280,
                                id: 'Graph',
                                title: 'Graph',
                                content: <VisUI />,
                            },
                        ],
                    },
                    {
                        // mode: 'vertical',
                        tabs: [
                            {
                                minHeight: 280,
                                id: 'artifacts',
                                title: 'Images',
                                content: <ArtifactsUI />,
                            },
                        ],
                    },
                ],
            },
            // {
            //     mode: 'vertical',
            //     tabs: [
            //         {
            //             minWidth: 280,
            //             id: 'library',
            //             title: 'Library',
            //             content: (
            //                 <>
            //                     {/* <MainActionsUI />
            //                     <VersionPickerUI />
            //                     <NodeListUI /> */}
            //                 </>
            //             ),
            //         },
            //     ],
            // },
            // {
            //     tabs: [{ id: 'tab3', title: 'tab1', content: <div>Hello World</div> }],
            // },
        ],
    },
})
