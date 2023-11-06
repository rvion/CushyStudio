import { observer } from 'mobx-react-lite'
import { Toggle } from 'rsuite'
import { Widget_strOpt } from 'src/controls/Widget'
import { WidgetStrUI } from './WidgetStrUI'

export const WidgetStrOptUI = observer(function WidgetStrOptUI_(p: { req: Widget_strOpt }) {
    const req = p.req
    const val = req.state.val

    return (
        <div className='flex gap-1'>
            <Toggle
                // size='sm'
                checked={req.state.active}
                onChange={(t) => (req.state.active = t)}
            />
            <WidgetStrUI req={req} />
        </div>
    )
})
