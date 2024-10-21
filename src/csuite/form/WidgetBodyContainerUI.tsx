import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../errors/ErrorBoundaryUI'
import { Frame, type FrameProps } from '../frame/Frame'

export type BodyContainerProps = FrameProps
export const WidgetBodyContainerUI = observer(function WidgetBodyContainerUI_(
    //
    p: BodyContainerProps,
) {
    return (
        <ErrorBoundaryUI>
            <Frame {...p} />
        </ErrorBoundaryUI>
    )
})
