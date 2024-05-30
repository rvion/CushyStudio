import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'

import { ErrorBoundaryFallback } from './ErrorBoundaryFallback'

export const ErrorBoundaryUI = observer(function CushyErrorBoundarySimpleUI_(p: { children: React.ReactNode }) {
    return (
        <ErrorBoundary //
            FallbackComponent={ErrorBoundaryFallback}
            onReset={(details) => {}}
        >
            {p.children}
        </ErrorBoundary>
    )
})
