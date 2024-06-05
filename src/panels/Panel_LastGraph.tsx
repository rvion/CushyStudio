import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../csuite/errors/ErrorBoundaryUI'
import { useSt } from '../state/stateContext'
import { GraphPreviewUI } from '../widgets/graph/GraphPreviewUI'

export const Panel_LastGraph = observer(function Panel_LastGraph_(p: {}) {
    const st = useSt()
    const lastGraph = st.db.comfy_workflow.last()
    return (
        <div>
            {lastGraph && (
                <ErrorBoundaryUI>
                    <GraphPreviewUI graph={lastGraph} />
                </ErrorBoundaryUI>
            )}
        </div>
    )
})
