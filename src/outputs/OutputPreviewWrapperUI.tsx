import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useSt } from 'src/state/stateContext'
import { StepOutput } from 'src/types/StepOutput'
import { ErrorBoundaryFallback } from 'src/widgets/misc/ErrorBoundary'

export const OutputPreviewWrapperUI = observer(function OutputPreviewWrapperUI_(p: {
    /** 3/4 letters max if possible */
    output: StepOutput

    /** must be able to scale to 64*64  */
    children: ReactNode

    /** size in px */
    size?: number
}) {
    const st = useSt()
    const sizeStr = p.size ? `${p.size}px` : st.historySizeStr
    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
            <div
                // STYLE
                tw='rounded cursor-pointer overflow-hidden'
                className='virtualBorder shrink-0'
                style={{ width: sizeStr, height: sizeStr }}
                // LOGIC
                onClick={() => runInAction(() => (st.focusedStepOutput = p.output))}
                onMouseEnter={(ev) => runInAction(() => (st.hovered = p.output))}
                onMouseLeave={() => {
                    if (st.hovered === p.output) runInAction(() => (st.hovered = null))
                }}
            >
                {p.children}
            </div>
        </ErrorBoundary>
    )
})
