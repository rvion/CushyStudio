import { observer } from 'mobx-react-lite'
import { Toggle } from 'rsuite'

// ----------------------------------------------------------------------

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: {
    //
    get: () => boolean
    set: (v: boolean) => void
    optional: boolean
}) {
    return (
        <Toggle //
            checked={p.get()}
            onChange={(checked) => p.set(checked)}
        />
    )
})
