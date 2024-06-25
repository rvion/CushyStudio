import { observer } from 'mobx-react-lite'

export const WidgetHeaderControlsContainerUI = observer(function WidgetHeaderControlsContainerUI_(p: {
    className?: string
    children: React.ReactNode
}) {
    return (
        <div //
            className={p.className}
            tw={[
                //
                'widget-header-container-ui',
                'COLLAPSE-PASSTHROUGH',
                'flex flex-1 items-center',
            ]}
        >
            {p.children}
        </div>
    )
})
