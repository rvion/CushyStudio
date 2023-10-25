import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { Widget, Widget_list } from 'src/controls/InfoRequest'
import { WidgetUI } from './WidgetUI'

export const WidgetListUI = observer(function WidgetListUI_<T extends Widget>(p: { req: Widget_list<T> }) {
    const req = p.req
    const values = req.state.items
    return (
        <div>
            <Button size='sm' onClick={() => req.addItem()}>
                Add
            </Button>
            {values.map((v, ix) => (
                <div tw='flex gap-2'>
                    <Button tw='self-center' onClick={() => req.removeItem(v)} size='xs'>
                        X
                    </Button>
                    <WidgetUI key={ix} req={v} />
                </div>
            ))}
        </div>
    )
})
