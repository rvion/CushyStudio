import { observer } from 'mobx-react-lite'
import { Message } from 'src/rsuite/shims'
import { Panel, panels } from './PANELS'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from 'src/widgets/misc/ErrorBoundary'

export const RenderPanelUI = observer(function RenderPanelUI_(p: { panel: Panel; panelProps: any }) {
    const { panel, panelProps } = p

    // 3. get panel definition
    const panelDef = (panels as any)[panel]
    if (panelDef == null)
        return (
            <Message type='error' showIcon>
                no panel definition for {panel}
            </Message>
        )

    const Component = panelDef.widget
    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
            <Component {...panelProps} className='w-full h-full border-none' />
        </ErrorBoundary>
    )
})
