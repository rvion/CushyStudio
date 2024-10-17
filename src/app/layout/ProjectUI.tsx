import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { useSt } from '../../state/stateContext'
import { GalleryHoveredPreviewUI } from '../../widgets/galleries/GalleryHoveredPreviewUI'

export const ProjectUI = observer(function ProjectUI_(p: {}) {
    const st = useSt()
    return (
        <div className='UI-MAIN relative h-full flex flex-grow flex-col'>
            <GalleryHoveredPreviewUI />
            <div
                id='hovered-graph'
                className='[z-index:2000] pointer-events-none absolute bottom-3 left-3 right-3 top-3 overflow-auto bg-opacity-80'
                style={{ transition: 'all 0.2s ease-in-out', opacity: 0 }}
            />
            <ErrorBoundaryUI>
                <st.layout.UI />
            </ErrorBoundaryUI>
        </div>
    )
})
