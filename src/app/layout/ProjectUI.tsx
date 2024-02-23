import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'

import { useSt } from '../../state/stateContext'
import { GalleryHoveredPreviewUI } from '../../widgets/galleries/GalleryHoveredPreviewUI'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'

export const ProjectUI = observer(function ProjectUI_(p: {}) {
    const st = useSt()
    return (
        <div className='relative flex-grow flex flex-col h-full'>
            <GalleryHoveredPreviewUI />
            <div
                id='hovered-graph'
                className='bg-base-300 bg-opacity-80 absolute top-3 left-3 right-3 bottom-3 [z-index:2000] overflow-auto pointer-events-none'
                style={{ transition: 'all 0.2s ease-in-out', opacity: 0 }}
            />
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                <st.layout.UI />
            </ErrorBoundary>
        </div>
    )
})
