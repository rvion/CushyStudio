import { observer } from 'mobx-react-lite'
import { InputNumber } from 'rsuite'
import { useStep } from '../FormCtx'

export const WidgetIntUI = observer(function WidgetBoolUI_(p: {
    //
    get: () => number
    set: (v: number) => void
}) {
    const step = useStep()

    return (
        <InputNumber //
            size='sm'
            value={p.get()}
            onChange={(next) => {
                let num = typeof next === 'string' ? parseInt(next, 10) : next
                if (isNaN(num) || typeof num != 'number') return console.log(`${JSON.stringify(next)} is not a number`)
                p.set(num)
            }}
        />
    )
})
