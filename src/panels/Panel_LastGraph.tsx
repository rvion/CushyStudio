import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'

import { useSt } from '../state/stateContext'
import { ErrorBoundaryFallback } from '../widgets/misc/ErrorBoundary'
import { GraphPreviewUI } from '../widgets/misc/MsgShowHTMLUI'

export const Panel_LastGraph = observer(function Panel_LastGraph_(p: {}) {
    const st = useSt()
    const lastGraph = st.db.graphs.last()
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
