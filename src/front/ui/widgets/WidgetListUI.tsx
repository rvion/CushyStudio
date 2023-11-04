import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { Widget, Widget_list } from 'src/controls/Widget'
import { WidgetUI } from './WidgetUI'

export const WidgetListUI = observer(function WidgetListUI_<T extends Widget>(p: { req: Widget_list<T> }) {
    const req = p.req
    const values = req.state.items
    const max = req.input.max
    const min = req.input.min
    return (
        <div>
            <Button
                //
                tw='mb-2'
                disabled={max ? req.state.items.length >= max : undefined}
                size='sm'
                onClick={() => req.addItem()}
            >
                Add
            </Button>
            {values.map((v, ix) => (
                <div tw='flex gap-2 items-center'>
                    <Button
                        disabled={min ? req.state.items.length <= min : undefined}
                        tw='self-center'
                        onClick={() => req.removeItem(v)}
                        size='xs'
                    >
                        X
                    </Button>
                    <WidgetUI key={ix} req={v} />
                </div>
            ))}
        </div>
    )
})
