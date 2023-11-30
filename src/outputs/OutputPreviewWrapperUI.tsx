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
}) {
    const st = useSt()
    const sizeStr = st.gallerySizeStr
    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
            <div
                //
                // STYLE
                tw='rounded cursor-pointer hover:shadow-xl hover:brightness-110'
                className='flex flex-rowcol-info virtualBorder2'
                style={{ width: sizeStr, height: sizeStr }}
                //
                // LOGIC
                onClick={() => (st.focusedStepOutputID = p.output)}
                onMouseEnter={(ev) => (st.hovered = p.output)}
                onMouseLeave={() => {
                    if (st.hovered === p.output) st.hovered = null
                }}
            >
                {p.children}
            </div>
        </ErrorBoundary>
    )
})
