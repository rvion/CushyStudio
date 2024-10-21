import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { useSt } from '../../state/stateContext'
import { GalleryHoveredPreviewUI } from '../../widgets/galleries/GalleryHoveredPreviewUI'

export const ProjectUI = observer(function ProjectUI_(p: {}) {
    return (
        <div className='UI-MAIN relative flex h-full grow flex-col'>
            <GalleryHoveredPreviewUI />
            <div
                id='hovered-graph'
                className='pointer-events-none absolute inset-3 overflow-auto bg-opacity-80 [z-index:2000]'
                style={{ transition: 'all 0.2s ease-in-out', opacity: 0 }}
            />
            <ErrorBoundaryUI>
                <cushy.layout.UI />
            </ErrorBoundaryUI>
        </div>
    )
})
