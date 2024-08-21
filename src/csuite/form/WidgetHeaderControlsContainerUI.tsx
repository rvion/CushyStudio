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
                'COLLAPSE-PASSTHROUGH',
                'flex flex-1 items-center',
                // 🔴 paradigm shift; the whole minh stuff was to avoid those padding; break a few invariants
                // VVVVVV
                // 'py-input',
                // THIS already injects min-height: var(--widget-height);
                // which should be sufficient/ better
                //  VVV
                'UI-WidgetHeaderControlsContainer',
            ]}
        >
            {p.children}
        </div>
    )
})
