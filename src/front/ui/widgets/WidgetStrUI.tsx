import { observer } from 'mobx-react-lite'
import { Input } from 'rsuite'

export const WidgetStrUI = observer(function WidgetStrUI_(p: {
    //
    get: () => string
    set: (v: string) => void
    nullable?: boolean
}) {
    return (
        <Input //
            type='text'
            onChange={(e) => p.set(e)}
            value={p.get()}
        />
    )
})
