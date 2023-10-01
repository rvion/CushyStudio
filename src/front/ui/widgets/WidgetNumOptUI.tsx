import { observer, useLocalObservable } from 'mobx-react-lite'
import { InputNumber, Toggle } from 'rsuite'

export const WidgetNumOptUI = observer(function WidgetNumOptUI_(p: {
    //
    get: () => Maybe<number>
    def: () => Maybe<number>
    set: (v: number | null) => void
    mode: 'int' | 'float'
}) {
    const val = p.get()
    const uiSt = useLocalObservable(() => {
        return {
            disabled: val == null,
            lastNumberVal: val ?? p.def() ?? 0,
        }
    })
    return (
        <div className='flex gap-1'>
            <Toggle
                // size='sm'
                checked={val != null}
                onChange={(checked) => {
                    if (checked) {
                        uiSt.disabled = false
                        p.set(uiSt.lastNumberVal)
                    } else {
                        uiSt.disabled = true
                        p.set(null)
                    }
                }}
            />
            <InputNumber //
                disabled={uiSt.disabled}
                step={{ int: 1, float: 0.1 }[p.mode]}
                size='sm'
                value={uiSt.lastNumberVal}
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

                    uiSt.lastNumberVal = num
                    p.set(num)
                }}
            />
        </div>
    )
})
