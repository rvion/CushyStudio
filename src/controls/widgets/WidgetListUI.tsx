import { observer } from 'mobx-react-lite'
import { Button } from 'src/rsuite/shims'
import { Widget, Widget_list } from 'src/controls/Widget'
import { WidgetUI } from './WidgetUI'

export const WidgetListUI = observer(function WidgetListUI_<T extends Widget>(p: { req: Widget_list<T> }) {
    const req = p.req
    const values = req.state.items
    const max = req.input.max
    const min = req.input.min
    return (
        <div className='_WidgetListUI' tw='flex-grow w-full'>
            <Button
                //
                tw='mb-2'
                disabled={max ? req.state.items.length >= max : undefined}
                size='xs'
                startIcon={<span className='material-symbols-outlined'>add</span>}
                onClick={() => req.addItem()}
            >
                Add
            </Button>
            <div tw='flex flex-col gap-1'>
                {values.map((v) => (
                    <div key={v.id} tw='flex items-start'>
                        <Button
                            appearance='subtle'
                            disabled={min ? req.state.items.length <= min : undefined}
                            tw='self-start'
                            onClick={() => req.removeItem(v)}
                            size='xs'
                        >
                            X
                        </Button>
                        <Button appearance='subtle' size='xs' onClick={() => (v.state.collapsed = !Boolean(v.state.collapsed))}>
                            {v.state.collapsed ? '▸' : '▿'}
                        </Button>
                        <WidgetUI req={v} />
                    </div>
                ))}
            </div>
        </div>
    )
})
