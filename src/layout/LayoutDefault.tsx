import { LayoutData } from 'rc-dock'
import { CivitaiUI } from '../civitai/CivitaiBrowserUI'
import { LoggerUI } from '../logger/LoggerUI'
import { NodeBrowserUI } from '../menu/AssetTreeUI'
import { FocusedProjectTreeUI } from '../menu/FocusedProjectTreeUI'
import { MenuUI } from '../menu/MenuUI'
import { OpenPoseViewerUI } from '../openpose/OpenPoseUI'
import { PGalleryUI } from '../panels/pGallery'
import { PGalleryFocusUI } from '../panels/pGalleryFocus'
import { ExecutionUI } from '../ui/ExecutionUI'
import { MainPanelUI } from '../ui/MainPaneUI'

// export const defaultLayout = (): LayoutData => ({
//     floatbox: {
//         mode: 'float',
//         children: [],
//     },
//     dockbox: {
//         mode: 'horizontal',
//         children: [
//             {
//                 mode: 'vertical',
//                 size: 1,
//                 minWidth: 250,
//                 children: [
//                     {
//                         tabs: [
//                             {
//                                 minWidth: 250,
//                                 minHeight: 300,
//                                 id: 'CSMenuUI',
//                                 title: 'CushyStudio',
//                                 content: <MenuUI />,
//                             },
//                         ],
//                     },
//                     {
//                         tabs: [
//                             {
//                                 minWidth: 250,
//                                 minHeight: 300,
//                                 id: 'CSMenuUI',
//                                 title: 'CushyStudio',
//                                 content: <FocusedProjectTreeUI />,
//                             },
//                         ],
//                     },
//                 ],
//             },

//             {
//                 // id: 'supersupersuper',
//                 // group: 'CENTRAL',
//                 mode: 'vertical',
//                 size: 10,
//                 // @ts-ignore
//                 destroyInactiveTabPane: true,
//                 children: [
//                     {
//                         size: 10,
//                         tabs: [
//                             {
//                                 id: 'Editor1',
//                                 title: 'Main',
//                                 content: <MainPanelUI />,
//                             },
//                             {
//                                 id: 'OpenPosePlayground',
//                                 title: 'OpenPose',
//                                 content: <OpenPoseViewerUI />,
//                             },
//                             // {
//                             //     minHeight: 280,
//                             //     id: 'PaintUI',
//                             //     title: 'Paint',
//                             //     content: <PaintUI />,
//                             // },
//                             // {
//                             //     minHeight: 280,
//                             //     id: 'Graph',
//                             //     title: 'Graph',
//                             //     content: <VisUI />,
//                             // },
//                         ],
//                     },
//                     {
//                         size: 3,
//                         tabs: [
//                             {
//                                 id: 'logs',
//                                 title: 'Logs',
//                                 content: <LoggerUI />,
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 mode: 'vertical',
//                 size: 3,
//                 children: [
//                     {
//                         // mode: 'vertical',
//                         tabs: [
//                             {
//                                 // minWidth: 10,
//                                 content: <ExecutionUI />,
//                                 title: 'Control Pane',
//                                 id: 'ExecutionUI',
//                             },
//                             {
//                                 content: <CivitaiUI />,
//                                 title: 'Civitai',
//                                 id: 'CivitaiUI',
//                                 minHeight: 200,
//                                 minWidth: 200,
//                             },
//                             {
//                                 content: <NodeBrowserUI />,
//                                 title: 'Node Browser',
//                                 id: 'NodeBrowserUI',
//                                 minHeight: 200,
//                                 minWidth: 200,
//                             },
//                             // {
//                             //     minWidth: 200,
//                             //     minHeight: 200,
//                             //     id: 'TestingArea',
//                             //     title: 'Testing',
//                             //     content: <PUploadUI />,
//                             // },
//                             // {
//                             //     // minWidth: 10,
//                             //     minHeight: 280,
//                             //     id: 'ArtifactsUI',
//                             //     title: 'Images',
//                             //     content: <ArtifactsUI />,
//                             // },
//                         ],
//                     },
//                     {
//                         mode: 'horizontal',
//                         children: [
//                             {
//                                 size: 3,
//                                 tabs: [
//                                     {
//                                         minWidth: 100,
//                                         minHeight: 100,
//                                         id: 'PGalleryFocusUI',
//                                         title: 'Last',
//                                         content: <PGalleryFocusUI />,
//                                     },
//                                     {
//                                         minWidth: 230,
//                                         // minHeight: 280,
//                                         id: 'PGalleryUI',
//                                         title: 'thumbnails',
//                                         content: <PGalleryUI />,
//                                     },
//                                 ],
//                             },
//                         ],
//                     },
//                     // {
//                     //     // mode: 'vertical',
//                     //     tabs: [
//                     //         // {
//                     //         //     minHeight: 280,
//                     //         //     id: 'Graph',
//                     //         //     title: 'Graph',
//                     //         //     content: <VisUI />,
//                     //         // },
//                     //     ],
//                     // },
//                 ],
//             },
//             // {
//             //     // mode: 'vertical',
//             //     tabs: [
//             //         {
//             //             minWidth: 280,
//             //             minHeight: 280,
//             //             id: 'artifacts',
//             //             title: 'Images',
//             //             content: <PGalleryUI />,
//             //         },
//             //     ],
//             // },
//             //         // {
//             //         //     minWidth: 280,
//             //         //     id: 'assets',
//             //         //     title: 'Assets',
//             //         //     content: (
//             //         //         <>
//             //         //             {/* <MainActionsUI />
//             //         //                 <VersionPickerUI />
//             //         //                 <NodeListUI /> */}
//             //         //         </>
//             //         //     ),
//             //         // },
//             //     ],
//             //     // tabs: [{ id: 'tab3', title: 'tab1', content: <div>Hello World</div> }],
//             // },
//         ],
//     },
// })
