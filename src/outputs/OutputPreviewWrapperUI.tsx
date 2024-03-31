import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useSt } from '../state/stateContext'
import { StepOutput } from '../types/StepOutput'
import { ErrorBoundaryFallback } from '../widgets/misc/ErrorBoundary'

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
                tw={[
                    'rounded overflow-clip border border-base-300 hover:border-primary hover:brightness-110 box-content bg-base-200',
                ]}
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
