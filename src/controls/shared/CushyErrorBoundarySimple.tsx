import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'

import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'

export const CushyErrorBoundarySimpleUI = observer(function CushyErrorBoundarySimpleUI_(p: { children: React.ReactNode }) {
    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
            {p.children}
        </ErrorBoundary>
    )
})
