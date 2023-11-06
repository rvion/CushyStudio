import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { GraphPreviewUI } from '../MsgShowHTMLUI'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from '../utils/ErrorBoundary'

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
