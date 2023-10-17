import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { SelectPicker } from 'rsuite'
import { Requestable_selectOne } from 'src/controls/InfoRequest'

export const WidgetSelectOneUI = observer(function WidgetSelectOneUI_(p: { req: Requestable_selectOne<any> }) {
    const req = p.req
    const val = req.state.val

    type Entry = { label: string; value: string }

    // do some magic to adapt to user-submitted enums without crashing
    const options: Entry[] = useMemo(() => {
        return req.input.choices.map((choice) => {
            const choice_ = choice as Record<string, unknown>
            const label =
                typeof choice_.label === 'string' && choice_.label.length > 0 //
                    ? choice_.label
                    : choice.type
            const value = choice.type
            return { label, value }
        })
    }, [req.input.choices])

    return (
        <>
            <pre>{JSON.stringify(options, null, 4)}</pre>
            <SelectPicker
                size='sm'
                data={options}
                value={val.type}
                onSelect={(value, item) => {
                    const next = req.input.choices.find((c) => c.type === value)
                    if (next == null) return console.log(`❌ WidgetSelectOneUI: could not find choice for ${value}`)
                    req.state.val = next
                }}
            />
        </>
    )
})
