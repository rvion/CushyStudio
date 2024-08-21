import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../errors/ErrorBoundaryUI'

export const WidgetBodyContainerUI = observer(function WidgetBodyContainerUI_(
    //
    p: React.HTMLAttributes<HTMLDivElement>,
) {
    return (
        <ErrorBoundaryUI>
            <div {...p} />
        </ErrorBoundaryUI>
    )
})
