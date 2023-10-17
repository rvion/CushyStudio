import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { Requestable, Requestable_list } from 'src/controls/InfoRequest'
import { WidgetUI } from './WidgetUI'

export const WidgetListUI = observer(function WidgetListUI_<T extends Requestable>(p: { req: Requestable_list<T> }) {
    const req = p.req
    const values = req.state.items
    return (
        <div className='foo'>
            <Button size='sm' onClick={() => req.addItem()}>
                Add
            </Button>
            {values.map((v, ix) => (
                <div tw='flex gap-2'>
                    <Button onClick={() => req.removeItem(v)} size='xs'>
                        X
                    </Button>
                    <WidgetUI key={ix} req={v} />
                </div>
            ))}
        </div>
    )
})
