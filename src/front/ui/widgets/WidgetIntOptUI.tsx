import { observer, useLocalObservable } from 'mobx-react-lite'
import { InputNumber, Toggle } from 'rsuite'

export const WidgetIntOptUI = observer(function WidgetBoolUI_(p: {
    //
    get: () => number | null
    set: (v: number | null) => void
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
                onChange={(num) => {
                    const next = typeof num === 'number' ? num : parseInt(num, 10)
                    if (typeof next != 'number') return console.log(`not a number: ${next}`)
                    uiSt.lastNumberVal = next
                    p.set(next)
                }}
            />
        </>
    )
})
