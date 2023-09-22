import { observer, useLocalObservable } from 'mobx-react-lite'
import { InputNumber, Toggle } from 'rsuite'

export const WidgetIntOptUI = observer(function WidgetBoolUI_(p: {
    //
    get: () => number | null
    set: (v: number | null) => void

    mode: 'int' | 'float'
}) {
    const val = p.get()
    const uiSt = useLocalObservable(() => {
        return {
            disabled: val == null,
            lastNumberVal: val ?? 0,
        }
    })
    return (
        <>
            <Toggle
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
        </>
    )
})
