import { observer } from 'mobx-react-lite'

export const WidgetHeaderControlsContainerUI = observer(function WidgetHeaderControlsContainerUI_(p: {
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={p.className} tw={'widget-header-container-ui COLLAPSE-PASSTHROUGH flex items-center gap-0.5 flex-1'}>
            {p.children}
        </div>
    )
})
