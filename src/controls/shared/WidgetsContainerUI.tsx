import { observer } from 'mobx-react-lite'

export const WidgetsContainerUI = observer(function WidgetsContainerUI_(p: {
    layout?: 'H' | 'V'
    className?: string
    children?: React.ReactNode
}) {
    const isHorizontal = p.layout === 'H'

    return (
        <div
            className={p.className}
            tw={[
                //
                isHorizontal ? `flex gap-1 flex-wrap` : `flex gap-1 flex-col`,
                'w-full',
                p.className,
            ]}
        >
            {p.children}
        </div>
    )
})
