import { LayoutData } from 'rc-dock'
import { ArtifactsUI } from '../ArtifactsUI'
import { EditorPaneUI } from '../EditorPaneUI'
import { ExecutionUI } from '../ExecutionUI'
import { IdeInfosUI } from '../IdeInfosUI'
import { PGalleryUI } from '../pConnect/pGallery'

export const defaultLayout = (): LayoutData => ({
    floatbox: {
        mode: 'float',
        children: [],
    },
    dockbox: {
        mode: 'horizontal',
        children: [
            {
                mode: 'vertical',
                size: 3,
                minWidth: 300,
                children: [
                    {
                        tabs: [
                            {
                                minWidth: 300,
                                minHeight: 300,
                                id: 'ide',
                                title: 'CushyStudio',
                                content: <IdeInfosUI />,
                            },
                        ],
                    },
                ],
            },

            {
                mode: 'vertical',
                size: 6,
                children: [
                    {
                        // mode: 'vertical',
                        tabs: [
                            {
                                // minWidth: 10,
                                id: 'node-list',
                                title: 'Control Pane',
                                content: <ExecutionUI />,
                            },
                            {
                                // minWidth: 10,
                                minHeight: 280,
                                id: 'artifacts',
                                title: 'Images',
                                content: <ArtifactsUI />,
                            },
                        ],
                    },
                    // {
                    //     // mode: 'vertical',
                    //     tabs: [
                    //         // {
                    //         //     minHeight: 280,
                    //         //     id: 'Graph',
                    //         //     title: 'Graph',
                    //         //     content: <VisUI />,
                    //         // },
                    //     ],
                    // },
                ],
            },
            {
                mode: 'vertical',
                size: 10,
                children: [
                    {
                        tabs: [
                            {
                                id: 'Editor1',
                                title: 'Project Code',
                                content: <EditorPaneUI />,
                            },
                            // {
                            //     minHeight: 280,
                            //     id: 'Graph',
                            //     title: 'Graph',
                            //     content: <VisUI />,
                            // },
                        ],
                    },
                    {
                        // mode: 'vertical',
                        tabs: [
                            {
                                // minWidth: 280,
                                // minHeight: 280,
                                id: 'artifacts',
                                title: 'Images',
                                content: <PGalleryUI />,
                            },
                        ],
                    },
                ],
            },
            // {
            //     // mode: 'vertical',
            //     tabs: [
            //         {
            //             minWidth: 280,
            //             minHeight: 280,
            //             id: 'artifacts',
            //             title: 'Images',
            //             content: <PGalleryUI />,
            //         },
            //     ],
            // },
            //         // {
            //         //     minWidth: 280,
            //         //     id: 'assets',
            //         //     title: 'Assets',
            //         //     content: (
            //         //         <>
            //         //             {/* <MainActionsUI />
            //         //                 <VersionPickerUI />
            //         //                 <NodeListUI /> */}
            //         //         </>
            //         //     ),
            //         // },
            //     ],
            //     // tabs: [{ id: 'tab3', title: 'tab1', content: <div>Hello World</div> }],
            // },
        ],
    },
})
