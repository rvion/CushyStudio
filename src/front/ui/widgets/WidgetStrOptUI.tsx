import { observer, useLocalObservable } from 'mobx-react-lite'
import { Input, Toggle } from 'rsuite'

export const WidgetStrOptUI = observer(function WidgetStrOptUI_(p: {
    //
    get: () => Maybe<string>
    def: () => Maybe<string>
    set: (v: string | null) => void
    textarea?: boolean
}) {
    const val = p.get()
    const uiSt = useLocalObservable(() => {
        return {
            disabled: val == null,
            lastStrVal: val ?? p.def() ?? '',
        }
    })
    return (
        <>
            <Toggle
                // size='sm'
                checked={val != null}
                onChange={(checked) => {
                    if (checked) {
                        uiSt.disabled = false
                        p.set(uiSt.lastStrVal)
                    } else {
                        uiSt.disabled = true
                        p.set(null)
                    }
                }}
            />
            <Input //
                disabled={uiSt.disabled}
                size='sm'
                value={uiSt.lastStrVal}
                onChange={(next) => {
                    uiSt.lastStrVal = next
                    p.set(next)
                }}
            />
        </>
    )
})
