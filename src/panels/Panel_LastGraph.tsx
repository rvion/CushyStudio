import { observer } from 'mobx-react-lite'
import { useSt } from '../state/stateContext'
import { GraphPreviewUI } from '../widgets/misc/MsgShowHTMLUI'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from '../widgets/misc/ErrorBoundary'

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
