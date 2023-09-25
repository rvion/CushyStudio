import { observer } from 'mobx-react-lite'
import { InputNumber } from 'rsuite'

export const WidgetNumUI = observer(function WidgetNumUI_(p: {
    //
    get: () => number
    def: () => Maybe<number>
    set: (v: number) => void
    mode: 'int' | 'float'
}) {
    const value = p.get() ?? p.def() ?? 0
    return (
        <InputNumber //
            size='sm'
            value={value}
            step={{ int: 1, float: 0.1 }[p.mode]}
            onChange={(next) => {
                // parse value
                let num =
                    typeof next === 'string' //
                        ? p.mode == 'int'
                            ? parseInt(next, 10)
                            : parseFloat(next)
                        : next

                // ensure is a number
                if (isNaN(num) || typeof num != 'number') {
                    return console.log(`${JSON.stringify(next)} is not a number`)
                }

                // ensure ints are ints
                if (p.mode == 'int') {
                    num = Math.round(num)
                }

                p.set(num)
            }}
        />
    )
})
