import DockLayout, { LayoutData } from 'rc-dock'
import { observer } from 'mobx-react-lite'
import { ComfyCodeEditorUI } from './ComfyCodeEditorUI'
import { MainActionsUI } from './MainActionsUI'
import { NodeListUI } from './NodeListUI'
import { VersionPickerUI } from './VersionPickerUI'
import { ArtifactsUI } from './ArtifactsUI'
import { StepListUI } from './StepListUI'
import { ProjectInfoUI } from './ProjectInfoUI'

export const AppLayoutUI = observer(function AppLayoutUI_(p: {}) {
    return (
        <DockLayout
            defaultLayout={defaultLayout()}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            }}
        />
    )
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
                                id: 'Project',
                                title: 'Project',
                                content: <ProjectInfoUI />,
                            },
                        ],
                    },
                    {
                        size: 9999,
                        tabs: [
                            {
                                minWidth: 180,
                                id: 'Steps',
                                title: 'Steps',
                                content: (
                                    <>
                                        {/* <MainActionsUI /> */}
                                        <StepListUI />
                                    </>
                                ),
                            },
                        ],
                    },
                ],
            },

            {
                mode: 'vertical',
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
            {
                mode: 'vertical',
                size: 9999,
                children: [
                    {
                        // mode: 'vertical',
                        size: 99999,
                        tabs: [{ id: 'Editor', title: 'tab1', content: <ComfyCodeEditorUI /> }],
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
                            {
                                minHeight: 280,
                                id: 'Graph',
                                title: 'Graph',
                                content: <div></div>,
                            },
                        ],
                    },
                ],
            },
            {
                mode: 'vertical',
                tabs: [
                    {
                        minWidth: 280,
                        id: 'library',
                        title: 'Library',
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
            // {
            //     tabs: [{ id: 'tab3', title: 'tab1', content: <div>Hello World</div> }],
            // },
        ],
    },
})
