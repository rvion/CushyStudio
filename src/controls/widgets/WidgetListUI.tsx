import { observer } from 'mobx-react-lite'
import { Widget, Widget_list } from 'src/controls/Widget'
import { Button, Message } from 'src/rsuite/shims'
import { ListControlsUI } from '../shared/ListControlsUI'
import { WidgetDI } from './WidgetUI.DI'

export const WidgetListUI = observer(function WidgetListUI_<T extends Widget>(p: { req: Widget_list<T> }) {
    const req = p.req
    const values = req.state.items
    const min = req.input.min
    const WidgetUI = WidgetDI.WidgetUI
    if (WidgetUI == null) return <Message type='error'>Internal list failure</Message>

    const len = values.length
    const indexWidth = len.toString().length
    return (
        <div className='_WidgetListUI' tw='flex-grow w-full'>
            <ListControlsUI req={p.req} />
            <div tw='flex flex-col gap-1'>
                {values.map((v, ix) => (
                    <div key={v.id} tw='flex items-start'>
                        <Button
                            style={{ width: `${indexWidth}rem` }}
                            appearance='subtle'
                            size='sm'
                            onClick={() => (v.state.collapsed = !Boolean(v.state.collapsed))}
                        >
                            {v.state.collapsed //
                                ? '▸'
                                : '▿'}
                            {ix}
                        </Button>
                        <WidgetUI req={v} />
                        <Button
                            appearance='subtle'
                            disabled={min ? req.state.items.length <= min : undefined}
                            tw='self-start'
                            onClick={() => req.removeItem(v)}
                            size='sm'
                        >
                            X
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
})
