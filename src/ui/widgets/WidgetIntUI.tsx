import { observer } from 'mobx-react-lite'
import { InputNumber } from 'rsuite'

export const WidgetIntUI = observer(function WidgetBoolUI_(p: {
    //
    get: () => number
    set: (v: number) => void
}) {
    return (
        <InputNumber //
            value={p.get()}
            onChange={(next) => {
                if (typeof next != 'number') return
                p.set(next)
            }}
        />
    )
})
