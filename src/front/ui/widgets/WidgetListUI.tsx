import { observer } from 'mobx-react-lite'
import { Button, Input } from 'rsuite'
import { Requestable } from 'src/controls/InfoRequest'

export const WidgetListUI = observer(function WidgetListUI_<T extends Requestable>(p: {
    //
    get: () => InfoAnswer<T>[]
    def: () => Maybe<InfoAnswer<T>[]>
    set: (v: string) => void
}) {
    const values = p.get() ?? p.def() ?? []
    return (
        <div className='foo'>
            <Button
                onClick={() => {
                    // p.set(values.push())
                }}
            >
                +
            </Button>
            {values.map((v, ix) => (
                <Input //
                    key={ix}
                    size='sm'
                    // value={value}
                    onChange={(next) => {
                        p.set(next)
                    }}
                />
            ))}
        </div>
    )
})
