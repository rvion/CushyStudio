import { observer } from 'mobx-react-lite'
import { useSt } from '../../state/stateContext'
import { GraphPreviewUI } from '../misc/MsgShowHTMLUI'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from '../misc/ErrorBoundary'

export const LastGraphUI = observer(function LastGraphUI_(p: {}) {
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
