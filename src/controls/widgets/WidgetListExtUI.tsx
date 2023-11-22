import { observer } from 'mobx-react-lite'
import { Widget, Widget_listExt } from 'src/controls/Widget'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { Button, Message } from 'src/rsuite/shims'
import { ListControlsUI } from '../shared/ListControlsUI'
import { WidgetRegionalUI } from './WidgetRegionalUI'
import { WidgetDI } from './WidgetUI.DI'

export const WidgetListExtUI = observer(function WidgetListExtUI_<T extends Widget>(p: { req: Widget_listExt<T> }) {
    if (p.req.input.mode === 'timeline') return <WidgetListExtUI_timeline req={p.req} />
    if (p.req.input.mode === 'regional') return <WidgetListExtUI_timeline req={p.req} />
    return <WidgetListExtUI_timeline req={p.req} />
})

function replacer(key: string, value: any) {
    if (key == 'item') return undefined
    // else if (key=="privateProperty2") return undefined;
    else return value
}

export const WidgetListExtUI_timeline = observer(function WidgetListExtUI_timeline_<T extends Widget>(p: {
    req: Widget_listExt<T>
}) {
    const req = p.req
    const values = req.state.items
    const max = req.input.max
    const min = req.input.min
    const WidgetUI = WidgetDI.WidgetUI
    if (WidgetUI == null) return <Message type='error'>Internal list failure</Message>

    const len = values.length
    const indexWidth = len < 10 ? 1 : len < 100 ? 2 : 3
    return (
        <div className='_WidgetListExtUI' tw='flex-grow w-full'>
            <ListControlsUI req={p.req} />
            <InputNumberUI min={64} max={1000} mode='int' value={req.state.w} onValueChange={(next) => (req.state.w = next)} />
            <InputNumberUI min={64} max={1000} mode='int' value={req.state.h} onValueChange={(next) => (req.state.h = next)} />
            <WidgetRegionalUI req={p.req} />
            <div tw='flex flex-col gap-1'>
                {values.map((x, ix) => {
                    const v = x.item
                    return (
                        <div>
                            <div key={v.id} tw='flex items-start'>
                                <Button
                                    style={{ width: `${indexWidth}rem` }}
                                    // tw='absolute left-0'
                                    appearance='subtle'
                                    size='sm'
                                    onClick={() => (v.state.collapsed = !Boolean(v.state.collapsed))}
                                >
                                    {v.state.collapsed ? '▸' : '▿'}
                                    {ix}
                                </Button>
                                <WidgetUI req={v} />
                                <Button
                                    appearance='subtle'
                                    disabled={min ? req.state.items.length <= min : undefined}
                                    tw='self-start'
                                    onClick={() => req.removeItem(x)}
                                    size='sm'
                                >
                                    X
                                </Button>
                            </div>
                            {v.state.collapsed ? null : <div tw='text-gray-400'>{JSON.stringify(x, replacer)}</div>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
})
