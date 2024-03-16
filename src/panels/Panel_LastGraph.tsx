import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'

import { useSt } from '../state/stateContext'
import { GraphPreviewUI } from '../widgets/graph/GraphPreviewUI'
import { ErrorBoundaryFallback } from '../widgets/misc/ErrorBoundary'

export const Panel_LastGraph = observer(function Panel_LastGraph_(p: {}) {
    const st = useSt()
    const lastGraph = st.db.comfy_workflow.last()
    return (
        <div>
            {lastGraph && (
                <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                    <GraphPreviewUI graph={lastGraph} />
                </ErrorBoundary>
            )}
        </div>
    )
})
