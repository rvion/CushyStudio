import { observer } from 'mobx-react-lite'
import { Loader } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { projectContext } from '../../ProjectCtx'
import { GalleryHoveredPreviewUI } from '../galleries/GalleryHoveredPreviewUI'
import { PanelConfigUI } from './PanelConfigUI'
import { MainNavBarUI } from './MainNavBarUI'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from '../utils/ErrorBoundary'

export const ProjectUI = observer(function ProjectUI_(p: {}) {
    const st = useSt()
    const project = st.db.projects.first()
    if (project == null)
        return (
            <div>
                <Loader />
                <PanelConfigUI />
            </div>
        )
    return (
        <div className='relative flex-grow flex flex-col h-full'>
            <projectContext.Provider value={project} key={project.id}>
                <MainNavBarUI />
                <GalleryHoveredPreviewUI />
                <div
                    id='hovered-graph'
                    className='absolute top-3 left-3 right-3 bottom-3 [z-index:2000] overflow-auto pointer-events-none'
                    style={{ transition: 'all 0.2s ease-in-out', opacity: 0 }}
                />
                {/* <div tw='relative w-full h-full'> */}
                <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                    {/* <GraphPreviewUI graph={lastGraph} /> */}
                    <st.layout.UI />
                </ErrorBoundary>
                {/* </div> */}
            </projectContext.Provider>
        </div>
    )
})
