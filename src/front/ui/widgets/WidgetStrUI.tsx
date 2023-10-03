import { observer } from 'mobx-react-lite'
import { Input } from 'rsuite'

export const WidgetStrUI = observer(function WidgetStrUI_(p: {
    //
    get: () => string
    def: () => Maybe<string>
    set: (v: string) => void
    textarea?: boolean
}) {
    const value = p.get() ?? p.def() ?? 0
    if (p.textarea) {
        return (
            <Input //
                as='textarea'
                rows={5}
                value={value}
                onChange={(next) => {
                    p.set(next)
                }}
            />
        )
    }
    return (
        <Input //
            size='sm'
            value={value}
            onChange={(next) => {
                p.set(next)
            }}
        />
    )
})
