import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'
import { Loader } from 'rsuite'
import { useSt } from '../../state/stateContext'
import { GalleryHoveredPreviewUI } from '../../widgets/galleries/GalleryHoveredPreviewUI'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'
import { Panel_Config } from '../../panels/Panel_Config'

export const ProjectUI = observer(function ProjectUI_(p: {}) {
    const st = useSt()
    const project = st.db.projects.first()
    if (project == null)
        return (
            <div>
                <Loader />
                <div>No project yet, you first need to connect to ComfyUI</div>
                <Panel_Config />
            </div>
        )
    return (
        <div className='relative flex-grow flex flex-col h-full'>
            <GalleryHoveredPreviewUI />
            <div
                id='hovered-graph'
                className='absolute top-3 left-3 right-3 bottom-3 [z-index:2000] overflow-auto pointer-events-none'
                style={{ transition: 'all 0.2s ease-in-out', opacity: 0 }}
            />
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                {/* <GraphPreviewUI graph={lastGraph} /> */}
                <st.layout.UI />
            </ErrorBoundary>
        </div>
    )
})
